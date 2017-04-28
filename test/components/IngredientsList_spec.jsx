import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';

const { 
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = TestUtils;

import { namedCallbacks, singleRecipe } from '../test_helpers';
import IngredientsList from '../../src/components/IngredientsList';

describe('IngredientsList', () => {
  let component;
  let added;
  const add = () => { added = true };

  beforeEach(() => {
    component = renderIntoDocument(
      <IngredientsList ingredients={singleRecipe.ingredients}
                       ingredientActions={namedCallbacks.ingredientActions}
                       recipeId={singleRecipe.id}
                       addIngredient={add}
                       isParentEditing={false} />
    )
  })

  it('renders an unordered list', () => {
    const ingredientsList = scryRenderedDOMComponentsWithTag(component, 'ul');

    expect(ingredientsList.length).to.equal(1);
  });

  it('renders each ingredient passed', () => {
    const ingredients = scryRenderedDOMComponentsWithTag(component, 'li');

    expect(ingredients.length).to.equal(singleRecipe.ingredients.length);
  });

  it('alerts the user if no ingredients are passed', () => {
    component = renderIntoDocument(
      <IngredientsList ingredients={[]}
                       ingredientActions={namedCallbacks.ingredientActions}
                       recipeId={singleRecipe.id}
                       addIngredient={add}
                       isParentEditing={false} />
    )

    const ingredients = scryRenderedDOMComponentsWithTag(component, 'li');

    expect(ingredients.length).to.equal(1);
    expect(ingredients[0].innerHTML).to.not.be.empty;
  });

  it('displays zero control buttons if parent is not editing', () => {
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons).to.be.empty;
  });


  describe('while parent is editing', () => {
    beforeEach(() => {
      added = false;

      component = renderIntoDocument(
        <IngredientsList ingredients={singleRecipe.ingredients}
                         ingredientActions={namedCallbacks.ingredientActions}
                         recipeId={singleRecipe.id}
                         addIngredient={add}
                         isParentEditing={true} /> 
      );
    })

    it('displays one control button to add ingredient', () => {
      const buttons = scryRenderedDOMComponentsWithTag(component, 'button');
      const addButton = buttons.find(
        button => button.innerHTML === 'Add Ingredient'
      );

      expect(addButton).to.exist;
    });

    it('invokes a callback when add ingredient button is clicked', () => {
      const addButton = scryRenderedDOMComponentsWithTag(component, 'button')
        .find( button => button.innerHTML === 'Add Ingredient' );

      Simulate.click(addButton);

      expect(added).to.equal(true);
    });
  })
})
