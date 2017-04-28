import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';

const { 
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = TestUtils;

import { namedCallbacks, singleRecipe } from '../test_helpers';
import ProcessList from '../../src/components/ProcessList';

describe('ProcessList', () => {
  let component;
  let added;
  const add = () => { added = true };

  beforeEach(() => {
    component = renderIntoDocument(
      <ProcessList process={singleRecipe.process}
                   processActions={namedCallbacks.processActions}
                   recipeId={singleRecipe.id}
                   addStep={add}
                   isParentEditing={false} />
    )
  })

  it('renders an ordered list', () => {
    const processList = scryRenderedDOMComponentsWithTag(component, 'ol');

    expect(processList.length).to.equal(1);
  });

  it('renders each step passed', () => {
    const steps = scryRenderedDOMComponentsWithTag(component, 'li');

    expect(steps.length).to.equal(singleRecipe.process.length);
  });

  it('alerts the user if no steps are passed', () => {
    component = renderIntoDocument(
      <ProcessList process={[]}
                   processActions={namedCallbacks.processActions}
                   recipeId={singleRecipe.id}
                   addStep={add}
                   isParentEditing={false} />
    )

    const steps = scryRenderedDOMComponentsWithTag(component, 'li');

    expect(steps.length).to.equal(1);
    expect(steps[0].innerHTML).to.not.be.empty;
  });

  it('displays zero control buttons if parent is not editing', () => {
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons).to.be.empty;
  });


  describe('while parent is editing', () => {
    beforeEach(() => {
      added = false;
      
      component = renderIntoDocument(
        <ProcessList process={singleRecipe.process}
                     processActions={namedCallbacks.processActions}
                     recipeId={singleRecipe.id}
                     addStep={add}
                     isParentEditing={true} /> 
      );
    })

    it('displays one control button to add a step', () => {
      const buttons = scryRenderedDOMComponentsWithTag(component, 'button');
      const addButton = buttons.find(
        button => button.innerHTML === 'Add Step'
      )

      expect(addButton).to.exist;
    });

    it('invokes a callback when add step button is clicked', () => {
      const addButton = scryRenderedDOMComponentsWithTag(component, 'button')
        .find( button => button.innerHTML === 'Add Step' );

      Simulate.click(addButton);

      expect(added).to.equal(true);
    });
  })
})
