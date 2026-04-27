import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";
import ReservationPage from "../pages/reservation/ReservationPage";
import ReservationDetailsPage from "../pages/reservation/details/ReservationDetailsPage";
import ReservationPaymentPage from "../pages/reservation/payment/ReservationPaymentPage";
import ReservationConfirmationPage from "../pages/reservation/confirmation/ReservationConfirmationPage";
import LoginPage from "../pages/auth/login/LoginPage";
import RegisterPage from "../pages/auth/register/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import HomePage from "../pages/home/HomePage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/reservation", element: <ReservationPage /> },
      { path: "/reservation/details", element: <ReservationDetailsPage /> },
      {
        path: "/reservation/payment/:id",
        element: <ReservationPaymentPage />,
      },
      {
        path: "/reservation/confirmation/:id",
        element: <ReservationConfirmationPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/profile", element: <ProfilePage /> },
    ],
  },
  {
    element: <AdminLayout />,
    children: [{ path: "/admin", element: <AdminDashboardPage /> }],
  },
]);
