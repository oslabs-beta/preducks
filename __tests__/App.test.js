import React from 'react';
import { configure, shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import AppContainer from '../src/containers/AppContainer.tsx';
import { App } from '../src/components/App.tsx';

configure({
  adapter: new EnzymeAdapter(),
  disableLifecycleMethods: true,
});

describe('App', () => {
  it('App renders AppContainer as a child', () => {
    const wrapped = shallow(<App />);
    expect(wrapped.find(AppContainer).length).toEqual(1);
  });
});
