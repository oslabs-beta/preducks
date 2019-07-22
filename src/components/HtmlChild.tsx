import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
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
  // const compStyle = childId === focusChildId
  //   ? {
  //     borderRadius: '10px',
  //     border: '1px solid white',
  //     color: 'black',
  //     fontWeight: 600,
  //     background: 'white',
  //   }
  //   : {
  //     borderRadius: '10px',
  //     border: '1px solid white',
  //     color: '#FFFFFF',
  //   };

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
