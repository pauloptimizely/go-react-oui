import React from 'react';
import { mount } from 'enzyme';

import <%= componentName %> from '../index';

describe('components/<%= componentName %>', function() {
  let component;
  beforeEach(function() {
    component = mount(
      <<%= componentName %>
      />
    );
  });

  afterEach(function() {
    component.unmount();
  });

  describe('basic rendering', function() {

  });

  describe('editing', function() {

  });

});
