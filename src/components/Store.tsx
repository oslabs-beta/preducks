import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Icon, IconButton, TextField } from '@material-ui/core';
import TypeSelect from './TypeSelect';
import validateInput from '../utils/validateInput.util';
import ErrorMessage from './ErrorMessage';

const Store = (props: any) => {

  const {
    reducer,
    reducers,
    interfaces,
    setReducer,
  } = props;
  const [validation, setValidation] = useState(validateInput(''));
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyIsArray, setPropertyIsArray] = useState(false);
  const [propertyInitialValue, setPropertyInitialValue] = useState('');
  const [isVisible, setVisibility] = useState(false);

  const handleChange = (event: Event, setter: any) => {
    const target: HTMLInputElement = event.target;
    setter((target.type === 'checkbox') ? target.checked : target.value);
    if (target.type === 'text') {
      const result = validateInput(target.value);
      setValidation(result);
    }
  }

  const addProperty = () => {
    if (validation.isValid && propertyType && propertyInitialValue) {
      const updatedReducer = reducers[reducer];
      updatedReducer.store[validation.input] = {
        type: propertyType,
        array: propertyIsArray,
        initialValue: propertyInitialValue,
      };
      setReducer({ [reducer]: updatedReducer });
      setPropertyName('');
      setPropertyType('');
      setPropertyIsArray(false);
      setPropertyInitialValue('');
      setVisibility(false);
    } else {
      setVisibility(true);
    }
  }

  const deleteProperty = (property: string) => {
    const updatedReducer = reducers[reducer];
    delete updatedReducer.store[property];
    setReducer({ [reducer]: updatedReducer });
  }

  return (
    <div id="store">
      <h4>Store</h4>
      <div className="table-wrapper">
        <table>
          <tbody>
            <tr>
              <th>name</th>
              <th>type</th>
              <th>array</th>
              <th>initial</th>
              <th></th>
            </tr>
            {reducers[reducer].store && Object.keys(reducers[reducer].store).map(store => (
              <tr key={"store" + store}>
                <td>{store}</td>
                <td>{reducers[reducer].store[store].type}</td>
                <td>{(reducers[reducer].store[store].array) ? '✓' : '×' }</td>
                <td className="code">{reducers[reducer].store[store].initialValue}</td>
                <td className="property-controls">
                  <IconButton
                    aria-label={`delete store item "${store}"`}
                    onClick={() => deleteProperty(store)}>
                    <Icon>delete</Icon>
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ErrorMessage validation={validation} visible={isVisible} />        
      <form className="new-store-item">
        <TextField
          label="name"
          value={propertyName}
          onChange={() => { handleChange(event, setPropertyName) }}
          required />
        <TypeSelect
          selectName="store-property-type"
          outer={reducer}
          interfaces={interfaces}
          value={propertyType}
          handleChange={(event: Event) => { handleChange(event, setPropertyType) }} />
        <FormControlLabel
          control = {
            <Checkbox
              checked={propertyIsArray}
              onChange={() => { handleChange(event, setPropertyIsArray) }} />
          }
          label="array" />
        <TextField
          label="initial value"
          value={propertyInitialValue}
          onChange={() => { setPropertyInitialValue(event.target.value) }}
          className="code"
          onKeyPress={event => {
            if (event.key === 'Enter') {
              addProperty();
              event.preventDefault();
            }
          }}
          required />
        <IconButton
          aria-label="add property to store"
          onClick={addProperty}
          className={(validation.isValid && propertyType && propertyInitialValue) ? '' : 'disabled'}>
          <Icon>add</Icon>
        </IconButton>
      </form>
    </div>
  );

};

export default Store;