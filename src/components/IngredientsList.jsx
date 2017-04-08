import React from 'react';
import Ingredient from './Ingredient';

export default class IngredientsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ul className="recipe-card_ingredients-list">
      {this.props.ingredients.map( ingredient => 
        <Ingredient {...ingredient}
                    key={ingredient.id}
                    recipeId={this.props.recipeId}
                    isParentEditing={this.props.isParentEditing}
                    editIngredient={this.props.editIngredient} 
                    cancelEditingIngredient={this.props.cancelEditingIngredient}
                    doneEditingIngredient={this.props.doneEditingIngredient}
                    deleteIngredient={this.props.deleteIngredient}
                    cancelDeletingIngredient={this.props.cancelDeletingIngredient} />
      )}

      {this.props.isParentEditing && 
        <button className="ingredient-control_add-ingredient"
                onClick={() => this.props.addIngredient(this.props.recipeId)}>
          Add Ingredient
        </button>
      }
    </ul>
  }
}
