import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteChild, changeFocusChild } from '../actions/components';
import { StoreInterface } from '../utils/InterfaceDefinitions';

const HtmlChild: React.FC = (props: any): JSX.Element => {
  const { classes, childId, color } = props;
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
        }}>
        <DeleteIcon style={{ color: 'white' }} />
      </Button>
    </Fragment>
  );

  return (
    <ListItem
      button
      onClick={() => dispatch(changeFocusChild({ childId }))}
      className="node-html-child">
      <div
        style={{ color: childId === focusChildId ? color : '' }}
        className={childId === focusChildId ? 'focused' : ''}>
        {props.componentName.toLowerCase()}
      </div>
      {deleteButton}
    </ListItem>
  );
};

export default withStyles({})(HtmlChild);
