import React, { Component } from 'react';
import { format } from 'prettier';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { rainbow as style } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import componentRender from '../utils/componentRender.util';
import { ComponentInt, ComponentsInt } from '../utils/Interfaces';

type Props = {
  focusComponent: ComponentInt;
  components: ComponentsInt;
};

class CodePreview extends Component<Props> {
  render(): JSX.Element {
    const focusComponent: ComponentInt = this.props.focusComponent;
    const components: ComponentsInt = this.props.components;
    // TODO: NEED TO FIGURE OUT HOW TO GET FORMATTING TO WORK ON CODE PREVIEW
    return (
      <div
        style={{
          marginBottom: '100px',
          overflow: 'auto',
          fontSize: '18px',
          backgroundColor: '#262626',
          border: '2px solid #e0e0e0',
          borderRadius: '20px',
          margin: '20px',
        }}>
        <SyntaxHighlighter style={style} customStyle={{ background: 'transparent' }}>
          {format(componentRender(focusComponent, components), {
            parser: 'typescript',
          })}
        </SyntaxHighlighter>
      </div>
    );
  }
}

export default CodePreview;
