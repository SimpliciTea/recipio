import React, {PropTypes} from 'react';
import IngredientsListItem from './IngredientsListItem';


export default class IngredientsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ul className="recipe-card_ingredients-list">
      {this.props.ingredients.length === 0 && <li>This recipe has no ingredients listed.</li>}

      {this.props.ingredients.map( ingredient => 
          <IngredientsListItem {...ingredient}
                               {...this.props.ingredientActions}
                               key={ingredient.id}
                               recipeId={this.props.recipeId}
                               isParentEditing={this.props.isParentEditing} />)}


      {this.props.isParentEditing && 
        <button className="ingredient-control_add-ingredient"
                onClick={() => this.props.addIngredient(this.props.recipeId)}>
          Add Ingredient
        </button>
      }
    </ul>
  }
}

IngredientsList.propTypes = {
  ingredients: PropTypes.array.isRequired,
  ingredientActions: PropTypes.object.isRequired,
  addIngredient: PropTypes.func.isRequired,
  recipeId: PropTypes.number.isRequired,
  isParentEditing: PropTypes.bool.isRequired
}
