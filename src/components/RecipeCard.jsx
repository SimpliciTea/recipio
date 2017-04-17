import React from 'react';
import PropTypes from 'prop-types';
import IngredientsList from './IngredientsList';
import ProcessList from './ProcessList';
import ProcessListItem from './ProcessListItem';


export default class RecipeCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <li className="recipe-list_recipe-card">
      <h2>{this.props.title}</h2>
    
      <IngredientsList ingredients={this.props.ingredients}
                       ingredientActions={this.props.ingredientActions}
                       addIngredient={this.props.ingredientActions.addIngredient}
                       recipeId={this.props.id}
                       isParentEditing={this.props.isEditing} />


      <ProcessList process={this.props.process}
                   processActions={this.props.processActions}
                   addStep={this.props.processActions.addStep}
                   recipeId={this.props.id}
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

RecipeCard.propTypes = {
  // from {...recipe}
  id: PropTypes.number.isRequired,
  ingredients: PropTypes.array.isRequired,
  process: PropTypes.array.isRequired,
  isEditing: PropTypes.bool.isRequired,
  
  // from {...actionMap.recipeCardActions}
  ingredientActions: PropTypes.object.isRequired,
  editRecipe: PropTypes.func.isRequired,
  cancelEditingRecipe: PropTypes.func.isRequired,
  doneEditingRecipe: PropTypes.func.isRequired
}
