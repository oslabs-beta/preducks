import React, { useState } from 'react';
import { Button, Icon, IconButton } from '@material-ui/core';

const StoreItemHeader = (props: any) => {
  const { storeItem, deleter } = props;
  const [ dialogIsVisible, setDialogVisibility ] = useState(false);

  const toggleVisibility = () => {
    setDialogVisibility(!dialogIsVisible);
  }

  return (
    <React.Fragment>
      <div className="confirm-delete" style={{ display: (dialogIsVisible) ? 'flex' : 'none' }}>
        <div>
          <Button
            variant="contained"
            onClick={() => deleter(storeItem)}
            className="delete">
              Delete&nbsp;“{storeItem}”
          </Button>
          <Button
            variant="contained"
            onClick={() => toggleVisibility()}>
              Cancel
          </Button>
        </div>
      </div>
      <header>
        <h3>{storeItem}</h3>
        <IconButton
          aria-label={`delete "${storeItem}"`}
          onClick={() => toggleVisibility()}
          className="delete-store-item">
          <Icon>delete</Icon>
        </IconButton>
      </header>
    </React.Fragment>
  );

};

export default StoreItemHeader;