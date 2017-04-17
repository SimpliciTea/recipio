import React from 'react';
import PropTypes from 'prop-types';


export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({value: ''});
  }

  // setting value at componentDidMount puts cursor at end of string
  // when autofocused
  componentDidMount() {
    this.setState({value: this.props.text});
  }

  cancelEditing() {
    this.props.cancelEditingSelf(this.props.recipeId, this.props.selfId);
  }

  doneEditing() {
    (this.props.text === this.state.value) ? 
      this.cancelEditing()
    : this.props.doneEditingSelf(this.props.recipeId, this.props.selfId, this.state.value);
  }

  _handleOnChange(e) {
    this.setState({value: e.target.value});
  }

  _handleOnBlur(e) {
    return this.cancelEditing();
  }

  _handleKeyDown(e) {
    switch (e.key) {
      case 'Enter':
        return this.doneEditing();
      case 'Escape':
        return this.cancelEditing();
    }
  }

  render() {
    if (this.props.fieldType === 'text') {
      return <input type="text"
                    className="field_input"
                    autoFocus={true}
                    value={this.state.value}
                    onChange={this._handleOnChange.bind(this)}
                    onBlur={this._handleOnBlur.bind(this)}
                    onKeyDown={this._handleKeyDown.bind(this)} />
    } else if (this.props.fieldType === 'textarea') {
      return <textarea className="field_input"
                       autoFocus={true}
                       onChange={this._handleOnChange.bind(this)}
                       onBlur={this._handleOnBlur.bind(this)}
                       value={this.state.value}
                       onKeyDown={this._handleKeyDown.bind(this)} />
    }
  }
}


TextInput.propTypes = {
  fieldType: PropTypes.string.isRequired,
  text: PropTypes.string,
  selfId: PropTypes.number.isRequired,
  recipeId: PropTypes.number.isRequired,
  cancelEditingSelf: PropTypes.func.isRequired,
  doneEditingSelf: PropTypes.func.isRequired
}
