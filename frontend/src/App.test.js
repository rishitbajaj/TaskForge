import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import authReducer from './store/authSlice';
import taskReducer from './store/taskSlice';

function renderApp(initialRoute = '/login') {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      tasks: taskReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
}

test('renders login page', () => {
  renderApp('/login');
  expect(screen.getByRole('heading', { name: /sign in to taskforge/i })).toBeInTheDocument();
});

test('renders register page', () => {
  renderApp('/register');
  expect(
    screen.getByRole('heading', { name: /create your taskforge account/i })
  ).toBeInTheDocument();
});
