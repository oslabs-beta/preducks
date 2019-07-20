import React from 'react';
import { Image, Description, EditAttributes, Link, List, LocalParking } from '@material-ui/icons';
import { Chip } from '@material-ui/core';

interface PropsInterface {
  addChild: any;
  focusComponent: any;
}

const HTMLComponentPanel = (props: PropsInterface) => {
  
  const { addChild } = props;

  const handleCreateHTMLChild = (type: string) => {
    addChild({ title: type, childType: type, HTMLInfo: {} });
  };

  return (
    <div id="html-component-panel">
      <span>add HTML element as child</span>
      <Chip
        label="Image"
        icon={<Image />}
        onClick={() => { handleCreateHTMLChild('Image') }}
        variant="outlined"
      />
      <Chip
        label="Form"
        icon={<Description />}
        onClick={() => { handleCreateHTMLChild('Form') }}
        variant="outlined"
      />
      <Chip
        label="Button"
        icon={<EditAttributes />}
        onClick={() => { handleCreateHTMLChild('Button') }}
        variant="outlined"
      />
      <Chip
        label="Link"
        icon={<Link />}
        onClick={() => { handleCreateHTMLChild('Link') }}
        variant="outlined"
      />
      <Chip
        label="List"
        icon={<List />}
        onClick={() => { handleCreateHTMLChild('List') }}
        variant="outlined"
      />
      <Chip
        label="Paragraph"
        icon={<LocalParking />}
        onClick={() => { handleCreateHTMLChild('Paragraph') }}
        variant="outlined"
      />
    </div>
  );

}

export default HTMLComponentPanel;
