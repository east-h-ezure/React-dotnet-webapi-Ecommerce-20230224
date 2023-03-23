import { Typography } from '@mui/material';
// import { CounterState, decrement, increment } from './couterReducer';
import {
  useAppDispatch,
  useAppSelector,
} from '../../app/store/configureStore.1';
import { Button, ButtonGroup } from '@mui/material';
import { increment, decrement } from './counterSlice';

const Contact = () => {
  // const dispatch = useDispatch();
  const dispatch = useAppDispatch();
  // const { data, title } = useSelector((state: CounterState) => state);
  const { data, title } = useAppSelector((state) => state.counter);
  console.log('contact', data);

  return (
    <>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">The data is {data}</Typography>
      <ButtonGroup>
        <Button
          onClick={() => dispatch(decrement(1))}
          variant="contained"
          color="error"
        >
          Decrement
        </Button>
        <Button
          onClick={() => dispatch(increment(1))}
          variant="contained"
          color="primary"
        >
          Increment
        </Button>
        <Button
          onClick={() => dispatch(increment(5))}
          variant="contained"
          color="secondary"
        >
          Increment by 5
        </Button>
      </ButtonGroup>
    </>
  );
};

export default Contact;
