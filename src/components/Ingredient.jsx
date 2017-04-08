import React from 'react';
import TextInput from './TextInput';

export default class Ingredient extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleEditIngredient(e) {
    this.props.isParentEditing && this.props.editIngredient(this.props.recipeId, this.props.id);
  }

  render() {
    return <li key={this.props.id}>
      <div className="view">  
        {this.props.isParentEditing && !this.props.hasPendingDeletion &&
          <button className="ingredient_control"
                  onClick={() => this.props.deleteIngredient(this.props.recipeId, this.props.id)}>
            -
          </button>
        }

        {this.props.isParentEditing && this.props.hasPendingDeletion &&
          <button className="ingredient_control"
                  onClick={() => this.props.cancelDeletingIngredient(this.props.recipeId, this.props.id)}>
            +
          </button>
        }

        <label htmlFor="ingredient"
               ref="text"
               onDoubleClick={this._handleEditIngredient.bind(this)} 
               style={this.props.hasPendingDeletion ? {textDecoration: 'line-through'} : {}}>
          {/* if there is a pendingUpdate in state, 
              display that as ingredient with an '*' 
              to indicate unsaved information on recipe.
              OTHERWISE display saved ingredient state text */}
          {this.props.hasPendingUpdate ? this.props.pendingUpdate + '*' : this.props.text}
        </label>
      </div>

      {this.props.isEditing &&
        <TextInput text={this.props.hasPendingUpdate ? this.props.pendingUpdate : this.props.text}
                   cancelEditingIngredient={this.props.cancelEditingIngredient}
                   doneEditingIngredient={this.props.doneEditingIngredient}
                   ingredientId={this.props.id}
                   recipeId={this.props.recipeId} />
      }
    </li>
  }
}

// edit item
// cancel editing
// finish editing
// delete item
// prop types

// STATE:
// id
// text
// hasPendingUpdate
// pendingUpdate

// ACTIONS:
// setPendingUpdate
