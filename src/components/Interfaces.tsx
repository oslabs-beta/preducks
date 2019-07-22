import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, IconButton, Icon } from '@material-ui/core';
import * as actions from '../actions/components';
import { InterfacesInterface, InputValidation } from '../utils/InterfaceDefinitions';
import Interface from './Interface';
import validateInput from '../utils/validateInput.util';
import ErrorMessage from './ErrorMessage';

const mapDispatchToProps = (dispatch: any) => ({
  setInterface: (myInterface: InterfacesInterface) => dispatch(actions.setInterface(myInterface)),
  deleteInterface: (interfaceName: string) => dispatch(actions.deleteInterface(interfaceName)),
});

const mapStateToProps = (store: any) => ({
  interfaces: store.workspace.storeConfig.interfaces,
});

interface PropsInterface {
  setInterface?: any;
  deleteInterface?: any;
  interfaces?: any;
  classes?: any;
  validateInput?: any;
}

interface StateInterface {
  newInterfaceValidation: InputValidation;
  newInterfaceNameInput: string;
  isVisible: boolean;
}

class Interfaces extends Component<PropsInterface, StateInterface> {
  constructor(props: PropsInterface) {
    super(props);
    this.state = {
      newInterfaceValidation: { isValid: false, input: '', error: '' },
      newInterfaceNameInput: '',
      isVisible: false,
    };
  }

  createInterface = () => {
    if (this.state.newInterfaceValidation.isValid) {
      const interfaceName = this.state.newInterfaceValidation.input;
      this.props.setInterface({ [interfaceName]: {} });
      this.setState({ newInterfaceNameInput: '' });
      this.setState({ isVisible: false });
    } else {
      this.setState({ isVisible: true });
    }
  };

  handleChange = (event: Event) => {
    const target: HTMLInputElement = event.target;
    const result: InputValidation = validateInput(target.value);
    this.setState({ newInterfaceNameInput: target.value, newInterfaceValidation: result });
  };

  render() {
    return (
      <section>
        <h2>Interfaces</h2>
        <div id="interfaces">
          {this.props.interfaces
            && Object.keys(this.props.interfaces).map(thisInterface => (
              <Interface
                thisInterface={thisInterface}
                interfaces={this.props.interfaces}
                setInterface={this.props.setInterface}
                deleteInterface={this.props.deleteInterface}
                key={`interface${thisInterface}`}
              />
            ))}
        </div>
        <ErrorMessage
          validation={this.state.newInterfaceValidation}
          visible={this.state.isVisible}
        />
        <form id="new-interface">
          <TextField
            label="new interface"
            value={this.state.newInterfaceNameInput}
            onChange={this.handleChange}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                this.createInterface();
                event.preventDefault();
              }
            }}
            required
          />
          <IconButton
            aria-label="create interface"
            onClick={this.createInterface}
            className={this.state.newInterfaceValidation.isValid ? '' : 'disabled'}>
            <Icon>add</Icon>
          </IconButton>
        </form>
      </section>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Interfaces);
