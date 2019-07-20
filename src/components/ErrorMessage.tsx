import React, { useState } from 'react';

const ErrorMessage = (props: any) => {

  const { validation, visible } = props;

  return (
    <div
      className="form-error-message"
      id="new-interface-error"
      style={{ visibility: (visible) ? 'visible' : 'hidden' }}>
      {validation.error || ''}&nbsp;
    </div>
  );

};

export default ErrorMessage;