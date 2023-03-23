import { Typography } from '@mui/material';
import { CounterState, decrement, increment } from './couterReducer';
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
          onClick={() => dispatch(decrement())}
          variant="contained"
          color="error"
        >
          Decrement
        </Button>
        <Button
          onClick={() => dispatch(increment())}
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
