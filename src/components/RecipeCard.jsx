import React from 'react';
import IngredientsList from './IngredientsList';
import ProcessList from './ProcessList';


export default class RecipeCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <li className="recipe-list_recipe-card">
      <h2>{this.props.title}</h2>
      <IngredientsList ingredients={this.props.ingredients}
                       isParentEditing={this.props.isEditing}
                       editIngredient={this.props.editIngredient}
                       cancelEditingIngredient={this.props.cancelEditingIngredient}
                       doneEditingIngredient={this.props.doneEditingIngredient}
                       addIngredient={this.props.addIngredient}
                       deleteIngredient={this.props.deleteIngredient}
                       cancelDeletingIngredient={this.props.cancelDeletingIngredient}
                       recipeId={this.props.id} />
      <ProcessList process={this.props.process} 
                   isParentEditing={this.props.isEditing} />
      
      {this.props.isEditing ? (
        <span className="button-group">
          <button className="recipe-card_control" onClick={() => this.props.doneEditingRecipe(this.props.id)}>
            Save
          </button>
          <button className="recipe-card_control" onClick={() => this.props.cancelEditingRecipe(this.props.id)}>
            Cancel
          </button>
        </span>
      ) : (
        <button className="recipe-card_control" onClick={() => this.props.editRecipe(this.props.id)}>
          Edit
        </button>
      )}
    </li>
  }
}
