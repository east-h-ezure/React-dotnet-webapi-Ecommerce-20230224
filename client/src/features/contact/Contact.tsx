import { Typography } from '@mui/material';
import {
  CounterState,
  DECREMENT_COUNTER,
  INCREMENT_COUNTER,
} from './couterReducer';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonGroup } from '@mui/material';

const Contact = () => {
  const dispatch = useDispatch();
  const { data, title } = useSelector((state: CounterState) => state);
  console.log('contact', data);

  return (
    <>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">The data is {data}</Typography>
      <ButtonGroup>
        <Button
          onClick={() => dispatch({ type: DECREMENT_COUNTER })}
          variant="contained"
          color="error"
        >
          Decrement
        </Button>
        <Button
          onClick={() => dispatch({ type: INCREMENT_COUNTER })}
          variant="contained"
          color="primary"
        >
          Increment
        </Button>
      </ButtonGroup>
    </>
  );
};

export default Contact;
