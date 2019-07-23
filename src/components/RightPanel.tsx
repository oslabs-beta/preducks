import React from 'react';
import Interfaces from './Interfaces';
import Reducers from './Reducers';
import validateInput from '../utils/validateInput.util';

const RightPanel = (props: any) => {
  const handleChange = (event: Event, setter: any, setValidation: any = '') => {
    const target: any = event.target;
    setter(target.type === 'checkbox' ? target.checked : target.value);
    if (setValidation !== '') {
      const result = validateInput(target.value);
      setValidation(result);
    }
  };

  return (
    <div className="right-panel">
      <Interfaces />
      <Reducers />
    </div>
  );
};

export default RightPanel;
