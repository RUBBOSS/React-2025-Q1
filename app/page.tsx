'use client';

import { Provider } from 'react-redux';
import HomePage from '../components/HomePage';
import { store } from '../redux/store';

export default function Home() {
  return (
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
}
