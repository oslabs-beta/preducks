import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import { updateHtmlAttr } from '../actions/components';
import { HTMLelements } from '../utils/htmlElements.util';
import { ComponentInt, ChildInt } from '../utils/InterfaceDefinitions';

interface PropsInt {
  updateHtmlAttr?: any;
  focusComponent?: ComponentInt;
  classes?: any;
  deleteProp?: any;
  addProp?: any;
  focusChild?: ChildInt;
}

interface StateInt {}

const styles = (theme: any): any => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    background: '#007BFF',
    color: 'white',
    borderRadius: '15px',
    border: '2px solid white',
  },
  cssLabel: {
    color: 'white',
  },
  cssFocused: {
    color: '#5CDB95',
  },
  input: {
    color: 'white',
    opacity: '0.7',
    marginBottom: '15px',
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  updateHtmlAttr: ({ attr, value }: { attr: string; value: string }) => dispatch(updateHtmlAttr({ attr, value })),
});

const mapStateToProps = (store: any) => ({
  focusComponent: store.workspace.focusComponent,
  focusChild: store.workspace.focusChild,
});

class HtmlAttr extends Component<PropsInt, StateInt> {
  state = HTMLelements[this.props.focusChild.htmlElement].attributes.reduce((acc, attr) => {
    acc[attr] = '';
    return acc;
  }, {});

  handleSave = (attr: string) => {
    this.props.updateHtmlAttr({ attr, value: this.state[attr] });
    this.setState({
      [attr]: '',
    });
  };

  handleChange = (event: any) => {
    this.setState({
      [event.target.id]: event.target.value.trim(),
    });
  };

  render() {
    const { classes, focusChild, focusComponent } = this.props;
    const focusChildType = focusChild.htmlElement;

    const HtmlForm = HTMLelements[focusChildType].attributes.map((attr: string, i: number) => (
      <Grid container spacing={0} key={i} style={{ marginTop: '10px', marginRight: '20px' }}>
        <Grid item xs={2}>
          <TextField
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              classes: {
                root: classes.cssFocused,
                focused: classes.cssFocused,
                notchedOutline: classes.notchedOutline,
              },
            }}
            style={{ background: '#4e4e4e', height: '70%', borderRadius: '10px' }}
            label={attr}
            variant="outlined"
            id={attr}
            onChange={this.handleChange}
            value={this.state[attr]}
          />
        </Grid>
        <Grid item xs={1}>
          <Fab
            variant="extended"
            size="small"
            color="default"
            aria-label="Save"
            style={{
              marginLeft: '10px',
              marginTop: '5px',
              marginBottom: '10px',
            }}
            onClick={() => this.handleSave(attr)}>
            {'save'}
          </Fab>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.root} style={{ height: '70%' }}>
            <h4 style={{ padding: '-10px 0px 0px 0px', alignSelf: 'center' }}>
              {focusChild.HTMLInfo[attr] ? focusChild.HTMLInfo[attr] : ' no attribute assigned'}
            </h4>
          </Paper>
        </Grid>
      </Grid>
    ));

    return (
      <div className={'htmlattr'}>
        <div className={'htmlattr-name'}>{`${focusChildType.toLowerCase()}`}</div>
        {HtmlForm}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(HtmlAttr));
