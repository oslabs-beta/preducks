import React, { Component } from 'react';
import { format } from 'prettier/standalone.js';
import parserBabylon from 'prettier/parser-babylon';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { dark as style } from 'react-syntax-highlighter/dist/esm/styles/prism';
import componentRender from '../utils/componentRender.util';
import { ComponentInt, ComponentsInt } from '../utils/InterfaceDefinitions';

SyntaxHighlighter.registerLanguage('jsx', jsx);

// const format = prettier.format;
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
            marginBottom: '100px',
            overflow: 'auto',
            fontSize: '14px',
            backgroundColor: '#262626',
            borderRadius: '20px',
            margin: '20px',
          }}>
          {format(componentRender(focusComponent, components), {
            singleQuote: true,
            trailingComma: 'es5',
            bracketSpacing: true,
            jsxBracketSameLine: true,
            parser: 'babel',
            plugins: [parserBabylon],
          })}
        </SyntaxHighlighter>
      </div>
    );
  }
}

export default CodePreview;
