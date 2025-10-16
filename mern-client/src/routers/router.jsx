import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import About from "../components/About";
// import Blog from "../components/Blog";
import SingleBook from "../shop/SingleBook";
import DashboardLayout from "../dashboard/DashboardLayout";
import Dashboard from "../dashboard/Dashboard";
import Uploadbook from "../dashboard/Uploadbook";
import ManageBook from "../dashboard/ManageBook";
import EditBooks from "../dashboard/EditBooks";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import Logout from "../components/Logout";
import Contact from "../components/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/book/:id",
        element: <SingleBook />,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/book/${params.id}`),
      },
    ],
  },
  // Admin Dashboard Protected Routes
  {
    path: "admin/dashboard",
    element: <PrivateRouter><DashboardLayout /></PrivateRouter>, // Protect the entire dashboard layout
    children: [
      {
        path: "dashboard", 
        element: <Dashboard />,
      },
      {
        path: "upload",
        element: <Uploadbook />,
      },
      {
        path: "manage",
        element: <ManageBook />,
      },
      {
        path: "edit-books/:id",
        element: <EditBooks />,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/book/${params.id}`),
      },
    ],
  },
  // Public Routes
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  }
]);

export default router;

