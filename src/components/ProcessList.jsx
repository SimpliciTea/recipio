import React, {PropTypes} from 'react';
import ProcessListItem from './ProcessListItem';

export default class ProcessList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ol className="recipe-card_process-list">
      {this.props.process.length === 0 && <li>This recipe has no steps listed.</li>}

      {this.props.process.map( step =>
        <ProcessListItem {...step}
                         {...this.props.processActions}
                         key={step.id}
                         recipeId={this.props.recipeId}
                         isParentEditing={this.props.isParentEditing} />)}

      {this.props.isParentEditing &&
        <button className="process-control_add-step"
                onClick={() => this.props.addStep(this.props.recipeId)}>
          Add Step
        </button>
      }
    </ol>
  }
}

ProcessList.propTypes = {
  process: PropTypes.array.isRequired,
  processActions: PropTypes.object.isRequired,
  addStep: PropTypes.func.isRequired,
  recipeId: PropTypes.number.isRequired,
  isParentEditing: PropTypes.bool.isRequired
}
