import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';


export default class ProcessListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  _handleEditStep(e) {
    this.props.isParentEditing && this.props.editStep(this.props.recipeId, this.props.id);
  }

  render() {
    return <li className='process-list_step'>
      <div className="view">
        {this.props.isParentEditing && !this.props.hasPendingDeletion &&
          <button className="process_control"
                  onClick={() => this.props.deleteStep(this.props.recipeId, this.props.id)}>
            -
          </button>
        }

        {this.props.isParentEditing && this.props.hasPendingDeletion && 
          <button className="process_control"
                  onClick={() => this.props.cancelDeletingStep(this.props.recipeId, this.props.id)}>
            +
          </button>
        }

        <label htmlFor="step"
               ref="text"
               onDoubleClick={this._handleEditStep.bind(this)}
               style={this.props.hasPendingDeletion ? {textDecoration: 'line-through'} : {}}>
          {/* if there is a pendingUpdate in state, 
              display that as step with an '*' 
              to indicate unsaved information on recipe.
              OTHERWISE display saved step state text */}
          {this.props.hasPendingUpdate ? this.props.pendingUpdate + '*' : this.props.text}
        </label>
      </div>

      {this.props.isEditing &&
        <TextInput fieldType={'textarea'}
                   text={this.props.hasPendingUpdate ? this.props.pendingUpdate : this.props.text}
                   cancelEditingSelf={this.props.cancelEditingStep}
                   doneEditingSelf={this.props.doneEditingStep}
                   selfId={this.props.id}
                   recipeId={this.props.recipeId} />
      }
    </li>
  }
}


ProcessListItem.propTypes = {
  recipeId: PropTypes.number.isRequired,
  isParentEditing: PropTypes.bool.isRequired,
  
  // from {...step}
  id: PropTypes.number.isRequired,
  text: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
  hasUpdatePending: PropTypes.bool.isRequired,
  hasPendingDeletion: PropTypes.bool.isRequired,
  pendingUpdate: PropTypes.string,
  
  // from {...processActions}
  editStep: PropTypes.func.isRequired,
  cancelEditingStep: PropTypes.func.isRequired,
  doneEditingStep: PropTypes.func.isRequired,
  addStep: PropTypes.func.isRequired,
  deleteStep: PropTypes.func.isRequired,
  cancelDeletingStep: PropTypes.func.isRequired
}
