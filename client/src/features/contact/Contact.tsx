import { Typography } from '@mui/material';
import { CounterState } from './couterReducer';
import { useSelector } from 'react-redux';

const Contact = () => {
  const { data, title } = useSelector((state: CounterState) => state);
  console.log('contact', data);

  return (
    <>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">The data is {data}</Typography>
    </>
  );
};

export default Contact;
