import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../action_creators';
import RecipeCard from './RecipeCard';

export class RecipioApp extends React.Component {
  constructor(props) {
    super(props);
  }

  getRecipes() {
    if (this.props.recipes) {
      return this.props.recipes;
    }

    return [];
  }

  render() {
    return <ul className="recipe-list">
      {this.getRecipes().map( recipe => 
        <RecipeCard key={recipe.get('title') + recipe.get('id')}
                    id={recipe.get('id')}
                    title={recipe.get('title')}
                    ingredients={recipe.get('ingredients').toJS()}
                    process={recipe.get('process').toJS()}
                    isEditing={recipe.get('isEditing')}
                    editRecipe={this.props.editRecipe}
                    cancelEditingRecipe={this.props.cancelEditingRecipe}
                    doneEditingRecipe={this.props.doneEditingRecipe}
                    editIngredient={this.props.editIngredient}
                    cancelEditingIngredient={this.props.cancelEditingIngredient}
                    doneEditingIngredient={this.props.doneEditingIngredient}
                    addIngredient={this.props.addIngredient}
                    deleteIngredient={this.props.deleteIngredient}
                    cancelDeletingIngredient={this.props.cancelDeletingIngredient}
                    saveRecipe={this.props.saveRecipe} />
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
