import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'
import App from './App.jsx'
import ErrorPage from './pages/Error.jsx';
import Helps from './pages/Helps.jsx';
import User from './pages/User.jsx';
import Volunteer from './pages/Volunteer.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/pedir-ajuda",
    element: <Helps />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/seja-voluntario",
    element: <Volunteer />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/meus-dados",
    element: <User />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
