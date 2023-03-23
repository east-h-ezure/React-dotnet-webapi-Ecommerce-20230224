import { createStore } from 'redux';
import { counterReducer } from '../../features/contact/couterReducer';

export function configureStore() {
  return createStore(counterReducer);
}
