import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';

const {
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = TestUtils;


import { namedCallbacks, singleRecipe } from '../test_helpers';
import IngredientsListItem from '../../src/components/IngredientsListItem';


describe('IngredientsListItem', () => {
  let component;
  const ingredient = singleRecipe.ingredients[0];

  // booleans for callbacks
  let deleted;
  let editing;

  // callbacks to test locally
  const scheduleDelete = () => { deleted = true };
  const undoDelete = () => { deleted = false };
  const edit = () => { editing = true };
  const cancelEditing = () => { editing = false };
  const doneEditing = () => { editing = false };

  beforeEach(() => {
    deleted = false;
    editing = false;

    component = renderIntoDocument(
      <IngredientsListItem {...ingredient}
                           {...namedCallbacks.ingredientsActions}
                           key={ingredient.id}
                           recipeId={singleRecipe.id}
                           isParentEditing={false}
                           deleteIngredient={scheduleDelete}
                           cancelDeletingIngredient={undoDelete}
                           editIngredient={edit}
                           cancelEditingIngredient={cancelEditing}
                           doneEditingIngredient={doneEditing} />
    );
  });


  it('renders a list item to display the ingredient', () => {
    const item = scryRenderedDOMComponentsWithTag(component, 'li');

    expect(item).to.exist;
  });

  it('renders a div with class "view"', () => {
    const view = scryRenderedDOMComponentsWithTag(component, 'div')[0];

    expect(view).to.exist;
    expect(view.classList.contains('view')).to.equal(true);
  });

  it('renders a label inside the "view" div with the saved ingredient text', () => {
    const label = scryRenderedDOMComponentsWithTag(component, 'label')[0];
    
    expect(label.innerHTML).to.equal(ingredient.text);
  })

  it('displays zero control buttons when parent is not editing', () => {
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons.length).to.equal(0);
  });

  it('invokes no callback when double clicked', () => {
    const label = scryRenderedDOMComponentsWithTag(component, 'label')[0];

    Simulate.doubleClick(label);
    expect(editing).to.equal(false);
  })

  
  describe('with pending update', () => {
    beforeEach(() => {
      component = renderIntoDocument(
        <IngredientsListItem {...ingredient}
                         {...namedCallbacks.ingredientsActions}
                         key={ingredient.id}
                         recipeId={singleRecipe.id}
                         text={'no asterisk in this string'}
                         isParentEditing={false}
                         hasPendingUpdate={true}
                         pendingUpdate={'pending'} />
      );
    })

    it('displays the pending update instead of the saved item text', () => {
      const label = scryRenderedDOMComponentsWithTag(component, 'label')[0];

      expect(label.innerHTML).to.contain(component.props.pendingUpdate);
    });

    it('suffixes the pending item text with an asterisk', () => {
      const label = scryRenderedDOMComponentsWithTag(component, 'label')[0];

      expect(label.innerHTML).to.contain('*');
    });
  })

  describe('with pending deletion', () => {
    it('displays the item with a strike-through', () => {
      component = renderIntoDocument(
        <IngredientsListItem {...ingredient}
                       {...namedCallbacks.ingredientsActions}
                       key={ingredient.id}
                       recipeId={singleRecipe.id}
                       isParentEditing={false}
                       hasPendingDeletion={true} />
      );

      const label = scryRenderedDOMComponentsWithTag(component, 'label')[0];

      expect(label.style.textDecoration).to.equal('line-through');
    })
  })

  describe('`while parent` is editing', () => {
    beforeEach(() => {
      deleted = false;
      editing = false;

      component = renderIntoDocument(
        <IngredientsListItem {...ingredient}
                       {...namedCallbacks.ingredientsActions}
                       key={ingredient.id}
                       recipeId={singleRecipe.id}
                       isParentEditing={true} 
                       editIngredient={edit} 
                       deleteIngredient={scheduleDelete} />
      );
    });

    it('invokes a callback when double clicked', () => {
      const label = scryRenderedDOMComponentsWithTag(component, 'label')[0];

      Simulate.doubleClick(label);
      expect(editing).to.equal(true);
    });

    it('displays one control button', () => {
      const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

      expect(buttons.length).to.equal(1);
    });

    it('invokes a callback when delete button is clicked', () => {
      const button = scryRenderedDOMComponentsWithTag(component, 'button')[0];

      Simulate.click(button);
      expect(deleted).to.equal(true);
    })

    describe('with deletion scheduled', () => {
      beforeEach(() => {
        deleted = true;

        component = renderIntoDocument(
          <IngredientsListItem {...ingredient}
                           {...namedCallbacks.ingredientsActions}
                           key={ingredient.id}
                           recipeId={singleRecipe.id}
                           isParentEditing={true}
                           hasPendingDeletion={true}
                           cancelDeletingIngredient={undoDelete} />
        );
      });
    

      it('displays one control button when scheduled for deletion', () => {
        const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

        expect(buttons.length).to.equal(1);
      });

      it('invokes a callback when undo button is clicked', () => {
        const button = scryRenderedDOMComponentsWithTag(component, 'button')[0];

        Simulate.click(button);
        expect(deleted).to.equal(false);
      });
    })
  })
});
