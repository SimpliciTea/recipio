import React from 'react';


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
    this.props.cancelEditingIngredient(this.props.recipeId, this.props.ingredientId);
  }

  doneEditing() {
    (this.props.text === this.state.value) ? 
      this.cancelEditing()
    : this.props.doneEditingIngredient(this.props.recipeId, this.props.ingredientId, this.state.value);
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
    return <input type="text"
           className="ingredient_input"
           autoFocus={true}
           value={this.state.value}
           onChange={this._handleOnChange.bind(this)}
           onBlur={this._handleOnBlur.bind(this)}
           onKeyDown={this._handleKeyDown.bind(this)} />
  }
}
