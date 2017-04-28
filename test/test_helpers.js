export const namedCallbacks = {
  editRecipe: f => f,
  cancelEditingRecipe: f => f,
  doneEditingRecipe: f => f,
  saveRecipe: f => f,
  ingredientActions: {
    editIngredient: f => f,
    cancelEditingIngredient: f => f,
    doneEditingIngredient: f => f,
    addIngredient: f => f,
    deleteIngredient: f => f,
    cancelDeletingIngredient: f => f
  },
  processActions: {
    editStep: f => f,
    cancelEditingStep: f => f,
    doneEditingStep: f => f,
    addStep: f => f,
    deleteStep: f => f,
    cancelDeletingStep: f => f
  }
}

export const singleRecipe = {
  id: 1,
  title: 'Macaroni',
  ingredients: [
    {
      id: 1, 
      text: 'Noodles',
      isEditing: false,
      hasUpdatePending: false,
      hasPendingDeletion: false, 
      pendingUpdate: null
    }, 
    {
      id: 2,
      text: 'Cheese',
      isEditing: false,
      hasUpdatePending: false,
      hasPendingDeletion: false,
      pendingUpdate: null
    }
  ],
  process: [
    {
      id: 1, 
      text: 'Boil Macaroni',
      isEditing: false,
      hasUpdatePending: false,
      hasPendingDeletion: false,
      pendingUpdate: null
    },
    {
      id: 2, 
      text: 'Stir in cheese',
      isEditing: false,
      hasUpdatePending: false,
      hasPendingDeletion: false,
      pendingUpdate: null
    }
  ],
  isEditing: false,
  hasPendingUpdate: false
};
