import React, {PropTypes} from 'react';
import TextInput from './TextInput';

export default class IngredientsListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleEditIngredient(e) {
    this.props.isParentEditing && this.props.editIngredient(this.props.recipeId, this.props.id);
  }

  render() {
    return <li className="recipe-card_ingredient"> 
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
        <TextInput fieldType={'text'}
                   text={this.props.hasPendingUpdate ? this.props.pendingUpdate : this.props.text}
                   cancelEditingSelf={this.props.cancelEditingIngredient}
                   doneEditingSelf={this.props.doneEditingIngredient}
                   selfId={this.props.id}
                   recipeId={this.props.recipeId} />
      }
    </li>
  }
}

IngredientsListItem.propTypes = {
  recipeId: PropTypes.number.isRequired,
  isParentEditing: PropTypes.bool.isRequired,
  
  // from {...ingredient}
  id: PropTypes.number.isRequired,
  text: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
  hasUpdatePending: PropTypes.bool.isRequired,
  hasPendingDeletion: PropTypes.bool.isRequired,
  pendingUpdate: PropTypes.string,
  
  // from {...ingredientActions}
  editIngredient: PropTypes.func.isRequired,
  cancelEditingIngredient: PropTypes.func.isRequired,
  doneEditingIngredient: PropTypes.func.isRequired,
  addIngredient: PropTypes.func.isRequired,
  deleteIngredient: PropTypes.func.isRequired,
  cancelDeletingIngredient: PropTypes.func.isRequired
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

