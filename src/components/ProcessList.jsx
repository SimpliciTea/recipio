import React from 'react';

export default class ProcessList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let isEditing = this.props.isEditing;

    return <ol className="recipe-card_process-list">
      {this.props.process.map( step =>
        <li key={step.id}>
          {isEditing && <span className="button-group">
            <button className="ingredient_control">
              -
            </button>
          </span>}

          {step.text}
        </li>
      )}
    </ol>
  }
}
