import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Icon, IconButton, TextField } from '@material-ui/core';
import TypeSelect from './TypeSelect';
import validateInput from '../utils/validateInput.util';
import ErrorMessage from './ErrorMessage';

const Actions = (props: any) => {

  const {
    reducer,
    reducers,
    interfaces,
    setReducer,
  } = props;
  const [propertyName, setPropertyName] = useState('');
  const [propertyIsAsync, setPropertyIsAsync] = useState(false);
  const [parameterName, setParameterName] = useState('');
  const [parameterType, setParameterType] = useState('');
  const [parameterIsArray, setParameterIsArray] = useState(false);
  const [payloadType, setPayloadType] = useState('');
  const [payloadIsArray, setPayloadIsArray] = useState(false);

  const [nameValidation, setNameValidation] = useState(validateInput(''));
  const [nameIsVisible, setNameVisibility] = useState(false);
  const [parameterNameValidation, setParameterNameValidation] = useState(validateInput(''));
  const [parameterNameIsVisible, setParameterNameVisiblility] = useState(false);

  const handleChange = (event: Event, setter: any, setValidation: any = '') => {
    const target: HTMLInputElement = event.target;
    setter((target.type === 'checkbox') ? target.checked : target.value);
    if (setValidation !== '') {
      const result = validateInput(target.value);
      setValidation(result);
    }
  }

  const addProperty = () => {
    if (nameValidation.isValid
      && parameterNameValidation.isValid
      && parameterType
      && payloadType) {
        const updatedReducer = reducers[reducer];
        updatedReducer.actions[nameValidation.input] = {
          parameter: {
            name: parameterNameValidation.input,
            type: parameterType,
            array: parameterIsArray
          },
          payload: {
            type: payloadType,
            array: payloadIsArray
          },
          async: propertyIsAsync,
        };
        setReducer({ [reducer]: updatedReducer });
        setPropertyName('');
        setPropertyIsAsync(false);
        setParameterName('');
        setParameterType('');
        setParameterIsArray(false);
        setPayloadType('');
        setPayloadIsArray(false);

        setNameVisibility(false);
        setParameterNameVisiblility(false);
    } else {
      setNameVisibility(true);
      setParameterNameVisiblility(true);
    }
  }

  const deleteProperty = (property: string) => {
    const updatedReducer = reducers[reducer];
    delete updatedReducer.actions[property];
    setReducer({ [reducer]: updatedReducer });
  }

  return (
    <div id="actions">
      <h4>Actions</h4>
      <div className="table-wrapper">
        <table>
          <tbody>
            <tr>
              <th>name</th>
              <th>async</th>
              <th>parameter</th>
              <th>parameter type</th>
              <th>parameter array</th>
              <th>payload type</th>
              <th>payload array</th>
              <th></th>
            </tr>
            {reducers[reducer].actions && Object.keys(reducers[reducer].actions).map(action => (
              <tr key={"action" + action}>
                <td>{action}</td>
                <td>{(reducers[reducer].actions[action].async) ? '✓' : '×' }</td>
                <td>{reducers[reducer].actions[action].parameter.name}</td>
                <td>{reducers[reducer].actions[action].parameter.type}</td>
                <td>{(reducers[reducer].actions[action].parameter.array) ? '✓' : '×' }</td>
                <td>{reducers[reducer].actions[action].payload.type}</td>
                <td>{(reducers[reducer].actions[action].payload.array) ? '✓' : '×' }</td>
                <td className="property-controls">
                  <IconButton
                    aria-label={`delete action "${action}"`}
                    onClick={() => deleteProperty(action)}>
                    <Icon>delete</Icon>
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="new-action-item">
        <ErrorMessage validation={nameValidation} visible={nameIsVisible} />
        <div>
          <TextField
            label="name"
            value={propertyName}
            onChange={() => { handleChange(event, setPropertyName, setNameValidation) }}
            required />
          <FormControlLabel
            control = {
              <Checkbox
                checked={propertyIsAsync}
                onChange={() => { handleChange(event, setPropertyIsAsync) }} />
            }
            label="async" />
        </div>
        <ErrorMessage validation={parameterNameValidation} visible={parameterNameIsVisible} />
        <span>Parameter</span>
        <div className="parameter-properties">
          <TextField
            label="name"
            value={parameterName}
            onChange={() => { handleChange(event, setParameterName, setParameterNameValidation) }}
            required />
          <TypeSelect
            selectName="parameter-type"
            outer={reducer}
            interfaces={interfaces}
            value={parameterType}
            handleChange={(event: Event) => { handleChange(event, setParameterType) }}
            required />
          <FormControlLabel
            control = {
              <Checkbox
                checked={parameterIsArray}
                onChange={() => { handleChange(event, setParameterIsArray) }} />
            }
            label="array" />
        </div>
        <ErrorMessage validation={nameValidation} visible={false} />
        <span>Payload</span>
        <div className="payload-properties">
          <TypeSelect
            selectName="payload-type"
            outer={reducer}
            interfaces={interfaces}
            value={payloadType}
            handleChange={(event: Event) => { handleChange(event, setPayloadType) }} />
          <FormControlLabel
            control = {
              <Checkbox
                checked={payloadIsArray}
                onChange={() => { handleChange(event, setPayloadIsArray) }} />
            }
            label="array" />
        </div>
        <IconButton
          aria-label="add action"
          onClick={addProperty}
          className={
            (nameValidation.isValid
              && parameterNameValidation.isValid
              && parameterType
              && payloadType
            ) ? '' : 'disabled'
          }>
          <Icon>add</Icon>
        </IconButton>
      </form>
    </div>
  );

};

export default Actions;