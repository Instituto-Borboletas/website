import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import './index.css'
import App from './App.jsx'
import ErrorPage from './pages/Error.jsx';
import Helps from './pages/Helps.jsx';
import User from './pages/User.jsx';
import Volunteer from './pages/Volunteer.jsx';
import Internal from './pages/Internal.jsx';
import Login from './pages/Login.jsx';

import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './contexts/auth.jsx';

const queryClient = new QueryClient();

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
  {
    path: "/interno",
    element: <Internal />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </AuthProvider>
  </QueryClientProvider>
)
