export const useChangeTodo = (dispatch) => {
  const handleToggleDone = (todo) => {
    dispatch({
      type: 'changed',
      todo: { ...todo, done: !todo.done },
    });
  };

  return { handleToggleDone };
};
