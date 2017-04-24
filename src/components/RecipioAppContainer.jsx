import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../action_creators';
import RecipeCard from './RecipeCard';

export class RecipioApp extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.actionMap = this.mapActionsToComponents();
  }

  // bundle actions to clean up passing props to nested components.
  // Not sure about connecting deeper children to Redux yet.
  mapActionsToComponents() {
    return {
      recipeCardActions: {
        editRecipe: this.props.editRecipe,
        cancelEditingRecipe: this.props.cancelEditingRecipe,
        doneEditingRecipe: this.props.doneEditingRecipe,
        saveRecipe: this.props.saveRecipe,
        ingredientActions: {
          editIngredient: this.props.editIngredient,
          cancelEditingIngredient: this.props.cancelEditingIngredient,
          doneEditingIngredient: this.props.doneEditingIngredient,
          addIngredient: this.props.addIngredient,
          deleteIngredient: this.props.deleteIngredient,
          cancelDeletingIngredient: this.props.cancelDeletingIngredient
        },
        processActions: {
          editStep: this.props.editStep,
          cancelEditingStep: this.props.cancelEditingStep,
          doneEditingStep: this.props.doneEditingStep,
          addStep: this.props.addStep,
          deleteStep: this.props.deleteStep,
          cancelDeletingStep: this.props.cancelDeletingStep
        }
      }
    }  
  }

  render() {
    return <ul className="recipe-list">
      {this.props.recipes.map( recipe => 
        <RecipeCard {...recipe.toJS()}
                    {...this.actionMap.recipeCardActions}
                    key={recipe.get('id')} />
      )}
      
    </ul>
  }
}

function mapStateToProps(state) {
  return {
    recipes: state.get('recipes')
  }
}

export const RecipioAppContainer = connect(mapStateToProps, actionCreators) (RecipioApp);
