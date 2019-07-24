import React, { Component } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { dark as style } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatter } from '../utils/formatter.util';
import componentRender from '../utils/componentRender.util';
import { ComponentInt, ComponentsInt } from '../utils/InterfaceDefinitions';

SyntaxHighlighter.registerLanguage('jsx', jsx);
type Props = {
  focusComponent: ComponentInt;
  components: ComponentsInt;
};

class CodePreview extends Component<Props> {
  render(): JSX.Element {
    const focusComponent: ComponentInt = this.props.focusComponent;
    const components: ComponentsInt = this.props.components;
    return (
      <div>
        <SyntaxHighlighter
          style={style}
          language="javascript"
          customStyle={{
            background: 'transparent',
            border: '2px solid #e0e0e0',
            overflow: 'auto',
            fontSize: '14px',
            backgroundColor: '#262626',
            borderRadius: '20px',
            margin: '10px 0px 0px 0px',
            height: '24vh',
          }}>
          {formatter(componentRender(focusComponent, components))}
        </SyntaxHighlighter>
      </div>
    );
  }
}

export default CodePreview;
