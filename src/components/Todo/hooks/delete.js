export const useDeleteTodo = (dispatch) => {
  const handleDeleteTodo = (id) => {
    dispatch({ type: 'deleted', id });
  };

  return { handleDeleteTodo };
};
