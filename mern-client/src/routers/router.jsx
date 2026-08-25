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
import ManageCategories from "../dashboard/ManageCategories";
import ManageReviews from "../dashboard/ManageReviews";
import ManageUsers from "../dashboard/ManageUsers";
import ChangePassword from "../dashboard/ChangePassword";
import EditBooks from "../dashboard/EditBooks";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import Contact from "../components/Contact";
import Account from "../components/Account";
import { apiUrl } from "../api/config";

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
        path: "/account",
        element: <Account />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/admin/login",
        element: <Login />,
      },
      {
        path: "/book/:id",
        element: <SingleBook />,
        loader: async ({ params }) => {
          const res = await fetch(apiUrl(`/book/${params.id}`));
          if (!res.ok) {
            throw new Response("Book not found", { status: res.status });
          }
          return res.json();
        },
      },
    ],
  },
  // Admin Dashboard Protected Routes
  {
    path: "admin/dashboard",
    element: <PrivateRouter><DashboardLayout /></PrivateRouter>, // Protect the entire dashboard layout
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
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
        path: "categories",
        element: <ManageCategories />,
      },
      {
        path: "reviews",
        element: <ManageReviews />,
      },
      {
        path: "users",
        element: <ManageUsers />,
      },
      {
        path: "password",
        element: <ChangePassword />,
      },
      {
        path: "edit-books/:id",
        element: <EditBooks />,
        loader: ({ params }) =>
          fetch(apiUrl(`/book/${params.id}`)),
      },
    ],
  },
]);

export default router;

