/* REDUCER UTILITY FUNCTIONS */

export function findItemIndex(collection, itemId) {
  return collection.findIndex(
    (item) => item.get('id') === itemId
  );
}

export function cancelPendingCollectionUpdates(collection) {
  // update collection
  // - filter out items where (saved text) item.text === null
  // - set item.isEditing to false
  // - set item.hasPendingUpdate to false
  // - set item.hasPendingDeletion to false
  // - set item.pendingUpdate to null
  return collection.filter( item => item.get('text') )
    .map( item => item.merge({
      isEditing: false,
      hasPendingUpdate: false,
      hasPendingDeletion: false,
      pendingUpdate: null
    }));
}

export function commitPendingCollectionUpdates(collection) {
  // update collection
  // - filter out items where item.hasPendingDeletion === true
  // - set all item.text to value stored in item.pendingUpdate
  // - set all item.hasPendingUpdate to false
  // - set all item.pendingUpdate to null
  // - set all item.isEditing to false
  return collection.filter( item => !item.get('hasPendingDeletion') ) 
    .map( item => item.merge({
      isEditing: false,
      hasPendingUpdate: false,
      text: item.get('pendingUpdate') || item.get('text'),
      pendingUpdate: null
    }));
}
