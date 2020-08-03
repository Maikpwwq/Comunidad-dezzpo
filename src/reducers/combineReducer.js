import {combineReducers} from 'redux';
import data from './data';
import todoApp from './todoApp';

export default combineReducers({
  data,
  todoApp
});