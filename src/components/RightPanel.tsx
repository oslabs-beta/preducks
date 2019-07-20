import React from 'react';
import Interfaces from './Interfaces';
import Reducers from './Reducers';

const RightPanel = (props: any) => {

  const handleChange = (event: Event, setter: any, setValidation: any = '') => {
    const target: HTMLInputElement = event.target;
    setter((target.type === 'checkbox') ? target.checked : target.value);
    if (setValidation !== '') {
      const result = validateInput(target.value);
      setValidation(result);
    }
  }

  return (
    <div className="right-panel">
      <Interfaces />
      <Reducers />
    </div>
  );
};

export default RightPanel;