import React from 'react';
import Image from '@material-ui/icons/Image';
import Description from '@material-ui/icons/Description';
import EditAttributes from '@material-ui/icons/EditAttributes';
import Link from '@material-ui/icons/Link';
import List from '@material-ui/icons/List';
import LocalParking from '@material-ui/icons/LocalParking';
import Chip from '@material-ui/core/Chip';

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
        style={{ borderColor: 'white' }}
        label="image"
        icon={<Image style={{ color: '#007BFF' }} />}
        onClick={() => {
          handleCreateHTMLChild('image');
        }}
        variant="outlined"
      />
      <Chip
        label="form"
        style={{ borderColor: 'white' }}
        icon={<Description style={{ color: '#007BFF' }} />}
        onClick={() => {
          handleCreateHTMLChild('form');
        }}
        variant="outlined"
      />
      <Chip
        label="button"
        style={{ borderColor: 'white' }}
        icon={<EditAttributes style={{ color: '#007BFF' }} />}
        onClick={() => {
          handleCreateHTMLChild('button');
        }}
        variant="outlined"
      />
      <Chip
        label="link"
        style={{ borderColor: 'white' }}
        icon={<Link style={{ color: '#007BFF' }} />}
        onClick={() => {
          handleCreateHTMLChild('link');
        }}
        variant="outlined"
      />
      <Chip
        label="list"
        style={{ borderColor: 'white' }}
        icon={<List style={{ color: '#007BFF' }} />}
        onClick={() => {
          handleCreateHTMLChild('list');
        }}
        variant="outlined"
      />
      <Chip
        label="paragraph"
        style={{ borderColor: 'white' }}
        icon={<LocalParking style={{ color: '#007BFF' }} />}
        onClick={() => {
          handleCreateHTMLChild('paragraph');
        }}
        variant="outlined"
      />
    </div>
  );
};

export default HTMLComponentPanel;
