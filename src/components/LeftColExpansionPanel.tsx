import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import uuid from 'uuid';
import Collapse from '@material-ui/core/Collapse';
import HtmlChild from './HtmlChild';
// import { ComponentInt, ComponentsInt, ChildInt } from '../utils/interfaces';

export const LeftColExpansionPanel = (props: any) => {
  const {
    classes,
    focusComponent,
    component,
    addChild,
    deleteChild,
    changeFocusComponent,
    selectableChildren,
    components,
    deleteComponent,
  } = props;
  const { title, id, color } = component;

  function isFocused() {
    return focusComponent.id === id ? 'focused' : '';
  }

  const focusedStyle = {
    boxShadow: '4px 2px 4px 2px rgba(150,150,150,0.2)',
    background: color,
  };

  const componentTitleDisplay = (
    <Grid item xs={12}>
      <List>
        <ListItem
          button
          disableRipple={true}
          onClick={() => {
            changeFocusComponent({ title });
          }}>
          <ListItemText
            disableTypography
            className={classes.light}
            primary={
              <Typography variant="h6" style={isFocused() ? { color: 'white' } : { color }}>
                {title}
              </Typography>
            }
          />
        </ListItem>
      </List>
    </Grid>
  );

  const deleteComponentButton = (
    <Fragment>
      <Button
        variant="text"
        size="small"
        color="default"
        aria-label="Delete"
        className={classes.margin}
        onClick={() => deleteComponent({
          componentId: id,
          stateComponents: components,
        })
        }
        style={{
          color: 'white',
          marginBottom: '10px',
          marginTop: '0px',
          marginLeft: '11px',
          padding: '4px',
          fontSize: '12px',
          borderRadius: '10px',
          border: '2px solid white',
        }}>
        {/* <DeleteIcon style={{ color: 'white' }} /> */}
        Delete Component
      </Button>
    </Fragment>
  );

  const addAsChildButton = (
    <Tooltip title="add as child" aria-label="add as child" placement="top">
      <IconButton
        aria-label="Add"
        onClick={() => {
          addChild({ title, childType: 'COMP' });
        }}>
        <AddIcon style={{ color, float: 'right' }} />
      </IconButton>
    </Tooltip>
  );

  const deleteChildButton = (
    <Tooltip title="remove child" aria-label="remove child" placement="top">
      <IconButton
        aria-label="Remove"
        onClick={() => {
          deleteChild(id);
        }}>
        <RemoveIcon style={{ color, float: 'right' }} />
      </IconButton>
    </Tooltip>
  );
  const HtmlChildrenOfFocusComponent = [];
  let thisComponentIsAChildOfFocusComponent = false;
  focusComponent.childrenArray.forEach((child) => {
    if (child.childType === 'HTML') {
      HtmlChildrenOfFocusComponent.push(
        <HtmlChild
          key={uuid()}
          HTMLInfo={child.HTMLInfo}
          childId={child.childId}
          componentName={child.componentName}
          focusComponentID={focusComponent.id}
          components={components}
        />,
      );
    } else if (child.childComponentId === id) {
      thisComponentIsAChildOfFocusComponent = true;
    }
  });

  return (
    <Grid container spacing={16} direction="row" justify="flex-start" alignItems="center">
      <Grid item xs={8}>
        <div className={classes.root} style={!isFocused() ? {} : focusedStyle}>
          {componentTitleDisplay}
          <Collapse in={isFocused() === 'focused'}>
            <Grid item xs={12} style={{ alignSelf: 'center' }}>
              <List>{isFocused() ? HtmlChildrenOfFocusComponent : <div />}</List>
            </Grid>
          </Collapse>
          {id !== 1 && isFocused() ? deleteComponentButton : <div />}
        </div>
      </Grid>
      <Grid item xs={2}>
        {id !== 1 && !isFocused() && selectableChildren.includes(id) ? addAsChildButton : <div />}
      </Grid>
      {id !== 1
      && !isFocused()
      && selectableChildren.includes(id)
      && thisComponentIsAChildOfFocusComponent ? (
        <Grid item xs={2}>
          {deleteChildButton}
        </Grid>
        ) : (
        <div />
        )}
    </Grid>
  );
};

function styles(): any {
  return {
    root: {
      width: '100%',
      height: '100%',
      borderRadius: '10px',
      marginTop: 10,
      backgroundColor: '#4e4e4e',
    },
    light: {
      color: '#eee',
      '&:hover': {
        color: '#1de9b6',
      },
    },
  };
}

export default withStyles(styles)(LeftColExpansionPanel);
