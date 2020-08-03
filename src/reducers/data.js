import {FETCH_TODOS} from '../actions/types';
import {todosRef} from '../firebase'

const FETCH_TODOS = 'FETCH_TODOS';

export default (state = {}, action) => {
    switch(action.type) {
      case FETCH_TODOS:
        return action.payload;
      default:
        return state;
    }
  };

export const addToDo = newToDo => async dispatch => {
  todosRef.push().set(newToDo);
};

export const completeToDo = completeToDo => async dispatch => {
  todosRef.child(completeToDo).remove();
};

export const fetchToDos = () => async dispatch => {
  todosRef.on("value", snapshot => {
    dispatch({
      type: FETCH_TODOS,
      payload: snapshot.val()
    });
  });
};