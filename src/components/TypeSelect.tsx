import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';

const TypeSelect = (props: any) => {
  const {
    selectName, outer, interfaces, labelName, handleChange, value,
  } = props;
  const defaultItems = ['boolean', 'number', 'string'];
  const items = [...defaultItems, ...Object.keys(interfaces), 'any'];

  return (
    <FormControl className="type-select" required>
      <InputLabel htmlFor={selectName + outer}>{labelName || 'type'}</InputLabel>
      <Select
        name={selectName + outer}
        value={value}
        onChange={handleChange}
        input={<Input name={selectName + outer} />}>
        {items
          && items.map((item) => {
            if (outer !== item) {
              return (
                <MenuItem value={item} key={outer + selectName + item}>
                  {item}
                </MenuItem>
              );
            }
          })}
      </Select>
    </FormControl>
  );
};

export default TypeSelect;
