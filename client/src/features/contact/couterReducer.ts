export interface CounterState {
  data: number;
  title: string;
}

const initialState: CounterState = {
  data: 42,
  title: 'YARC (yet another redux counter)',
};

export function counterReducer(state = initialState, action: any) {
  return state;
}
