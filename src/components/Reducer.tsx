import React, { useState } from 'react';
import Store from './Store';
import Actions from './Actions';
import StoreItemHeader from './StoreItemHeader';

const Reducer = (props: any) => {

  const {
    reducer,
    reducers,
    interfaces,
    setReducer,
    deleteReducer,
  } = props;

  return (
    <div className="reducer" key={'reducer' + reducer}>  
      <StoreItemHeader storeItem={reducer} deleter={deleteReducer} />
      <Store
        reducer={reducer}
        reducers={reducers}
        interfaces={interfaces}
        setReducer={setReducer} />
      <Actions
        reducer={reducer}
        reducers={reducers}
        interfaces={interfaces}
        setReducer={setReducer} />
    </div>
  );

};

export default Reducer;