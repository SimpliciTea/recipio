import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';

const { 
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = TestUtils;

import { namedCallbacks, singleRecipe } from '../test_helpers';
import RecipeCard from '../../src/components/RecipeCard';


describe('RecipeCard', () => {
  let component;

  beforeEach(() => {
    component = renderIntoDocument(
      <RecipeCard {...singleRecipe} {...namedCallbacks}/>
    );
  });


  it('renders an unordered list of ingredients with correct class', () => {
    const ingredientsList = scryRenderedDOMComponentsWithTag(component, 'ul');

    expect(ingredientsList[0]).to.exist;
    expect(ingredientsList[0].classList.contains('recipe-card_ingredients-list')).to.equal(true);
  });

  
  it('renders an ordered list of steps with correct class', () => {
    const processList = scryRenderedDOMComponentsWithTag(component, 'ol');

    expect(processList[0]).to.exist;
    expect(processList[0].classList.contains('recipe-card_process-list')).to.equal(true);
  });

  
  it('renders one control button when recipe.isEditing is false', () => {
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons.length).to.equal(1);
  });

  
  it('invokes editRecipe callback when edit recipe button is clicked', () => {
    let editing = false;
    const toggleEditing = () => { editing = true };

    component = renderIntoDocument(
      <RecipeCard {...singleRecipe}
                  {...namedCallbacks}
                  editRecipe={toggleEditing} />
    )

    const editButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
    Simulate.click(editButton);

    expect(editing).to.equal(true);
  });


  describe('while editing', () => {
    // dummy callbacks
    let saved;
    const save = () => { saved = true };
    let canceled;
    const cancelEditing = () => { canceled = true };

    beforeEach(() => {
      saved = false;
      canceled = false;

      component = renderIntoDocument(
        <RecipeCard {...singleRecipe}
                    {...namedCallbacks} 
                    isEditing={true}
                    cancelEditingRecipe={cancelEditing}
                    doneEditingRecipe={save} />
      );
    });


    it('renders two control buttons of it\'s own with class "recipe-card_control"', () => {
      const ownButtons = scryRenderedDOMComponentsWithTag(component, 'button')
        .filter( button => button.classList.contains('recipe-card_control'));
      

      expect(ownButtons.length).to.equal(2);        
    });


    it('invokes a callback when cancel editing button is clicked', () => {
      const ownButtons = scryRenderedDOMComponentsWithTag(component, 'button')
        .filter( button => button.classList.contains('recipe-card_control') );

      const cancelButton = ownButtons.find( 
        button => button.innerHTML === 'Cancel'
      );

      Simulate.click(cancelButton);

      expect(canceled).to.equal(true);
    });

  
    it('invokes a callback when save button is clicked', () => {
      const ownButtons = scryRenderedDOMComponentsWithTag(component, 'button')
        .filter( button => button.classList.contains('recipe-card_control') );

      const saveButton = ownButtons.find(
        button => button.innerHTML === 'Save'
      );

      Simulate.click(saveButton);

      expect(saved).to.equal(true);
    })
  })

})
