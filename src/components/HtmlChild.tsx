import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteChild, changeFocusChild } from '../actions/components';
import { StoreInterface } from '../utils/Interfaces';

export const HtmlChild: React.FC = (props: any): JSX.Element => {
  const { classes, childId } = props;
  const dispatch = useDispatch();
  const focusChildId = useSelector((store: StoreInterface) => store.workspace.focusChild).childId;
  const deleteButton = (
    <Fragment>
      {/* shows the delete button */}
      <Button
        variant="text"
        size="small"
        color="default"
        aria-label="Delete"
        className={classes.margin}
        onClick={() => {
          dispatch(deleteChild(childId));
        }}
        style={{
          color: 'white',
          marginBottom: '10px',
          marginTop: '0px',
        }}>
        <DeleteIcon style={{ color: 'white' }} />
      </Button>
    </Fragment>
  );
  const compStyle = childId === focusChildId
    ? {
      borderRadius: '10px',
      border: '1px solid white',
      color: 'black',
      fontWeight: 600,
      background: 'white',
      width: '80px',
    }
    : {
      borderRadius: '10px',
      border: '1px solid white',
      color: '#FFFFFF',
      width: '80px',
    };

  return (
    <ListItem button onClick={() => dispatch(changeFocusChild({ childId }))}>
      <div style={compStyle}>
        <ListItemText
          disableTypography
          className={classes.light}
          primary={<Typography>{props.componentName.toLowerCase()}</Typography>}
        />
      </div>
      {deleteButton}
    </ListItem>
  );
};

// const styles = theme => ({
//   root: {
//     display: 'flex',
//     justifyContent: 'center',
//     flexWrap: 'wrap',
//   },
//   chip: {
//     color: 'white',
//     backgroundColor: 'white',
//   },
//   column: {
//     display: 'inline-flex',
//     alignItems: 'baseline',
//   },
//   icon: {
//     fontSize: '20px',
//     color: 'white',
//     opacity: '0.7',
//     transition: 'all .2s ease',

//     '&:hover': {
//       color: 'red',
//     },
//   },
//   cssLabel: {
//     color: 'white',

//     '&$cssFocused': {
//       color: 'green',
//     },
//   },
//   cssFocused: {},
//   light: {
//     color: '#eee',
//   },
//   avatar: {
//     color: '#eee',
//     fontSize: '10px',
//   },
// });

export default withStyles({})(HtmlChild);
