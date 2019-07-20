import React, { useState } from 'react';
import { TextField, IconButton, Icon } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import TypeSelect from './TypeSelect';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import validateInput from '../utils/validateInput.util';
import ErrorMessage from './ErrorMessage';
import StoreItemHeader from './StoreItemHeader';

const Interface = (props: any) => {

  const {
    thisInterface,
    interfaces,
    setInterface,
    deleteInterface,
  } = props;
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newPropertyType, setNewPropertyType] = useState('');
  const [newPropertyIsArray, setNewPropertyIsArray] = useState(false);
  const [newPropertyValidation, setNewPropertyValidation] = useState(validateInput(''));
  const [isVisible, setVisibility] = useState(false);

  const handleChange = (event: Event, setter: any) => {
    const target: HTMLInputElement = event.target;
    setter(target.value);
    const result = validateInput(target.value);
    setNewPropertyValidation(result);
  }

  const addProperty = () => {
    if (newPropertyValidation.isValid && newPropertyType) {
      const updatedInterface = interfaces[thisInterface];
      updatedInterface[newPropertyValidation.input] = newPropertyType;
      setInterface({ [thisInterface]: updatedInterface });
      setNewPropertyName('');
      setNewPropertyType('');
      setNewPropertyIsArray(false);
      setVisibility(false);
    } else {
      setVisibility(true);
    }
  }

  const deleteProperty = (property) => {
    const updatedInterface = interfaces[thisInterface];
    delete updatedInterface[property];
    setInterface({ [thisInterface]: updatedInterface });    
  }

  return (
    <div className="interface" key={'interface' + thisInterface}>
      <StoreItemHeader storeItem={thisInterface} deleter={deleteInterface} />
      <div>
        {interfaces[thisInterface]
          && Object.keys(interfaces[thisInterface]).map(property => (
          <div className="property" id={property} key={property}>
            <ul className="property-info">
              <li>
                <div className="info-title">name</div>
                <div>{property}</div>
              </li>
              <li>
                <div className="info-title">type</div>
                <div>{interfaces[thisInterface][property]}</div>
              </li>
            </ul>
            <div className="property-controls">
              <IconButton
                aria-label={`delete property "${property}"`}
                onClick={() => deleteProperty(property)}>
                <Icon>delete</Icon>
              </IconButton>
            </div>
          </div>
        ))}
      </div>
      <ErrorMessage validation={newPropertyValidation} visible={isVisible} />
      <form className="new-interface-property">
        <TextField
          id="interface-property-name"
          label="property name"
          value={newPropertyName}
          onChange={() => { handleChange(event, setNewPropertyName) }}
          onKeyPress={event => {
            if (event.key === 'Enter')
              event.preventDefault();
          }}
          required
          />
        <TypeSelect
          selectName="interface-property-type"
          outer={thisInterface}
          interfaces={interfaces}
          value={newPropertyType}
          handleChange={(event: Event) => { setNewPropertyType(event.target.value) }}
        />
        <FormControlLabel
          value="top"
          control={<Checkbox 
            color="primary" 
            value={newPropertyIsArray}
            onChange={() => {
              if (newPropertyIsArray) {
                // remove []
                setNewPropertyType(type => {
                  if (type.indexOf('[') !== -1) {
                    return type.slice(0, type.length - 2)
                  } else {
                    return type;
                  }
                })
              } else {
                setNewPropertyType(type => type + '[]');
              }
              setNewPropertyIsArray(isArray => !isArray)
            }}
          />}
          label="array?"
          labelPlacement="top"
        />
        <IconButton
          aria-label="add property"
          onClick={addProperty}
          className={(newPropertyValidation.isValid && newPropertyType) ? '' : 'disabled'}>
          <Icon>add</Icon>
        </IconButton>
      </form>
    </div>
  );

};

export default Interface;