import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import LoginPage from "../pages/auth/login/LoginPage";
import RegisterPage from "../pages/auth/register/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import HomePage from "../pages/home/HomePage";
import ProfilePage from "../pages/profile/ProfilePage";
import ReservationConfirmationPage from "../pages/reservation/confirmation/ReservationConfirmationPage";
import ReservationDetailsPage from "../pages/reservation/details/ReservationDetailsPage";
import ReservationPaymentPage from "../pages/reservation/payment/ReservationPaymentPage";
import ReservationPage from "../pages/reservation/ReservationPage";

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
