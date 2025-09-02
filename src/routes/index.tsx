import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GamePage from '../pages/GamePage';
import SetupPage from '../pages/SetupPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SetupPage />,
  },
  {
    path: '/game',
    element: <GamePage />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;