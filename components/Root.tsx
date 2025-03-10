import React from 'react';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ThemeProvider } from '../context/ThemeContext';

export default function Root() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="app-container">
          <Outlet />
        </div>
      </ThemeProvider>
    </Provider>
  );
}
