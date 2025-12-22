import DistroPoLandingPage from "../../pages/distro-po/landingPage";
import DistroPoLandingPage2 from "../../pages/distro-po/landing2";
import DistributorPOForm from "../../pages/distro-po/form";
import POList from "../../pages/distro-po/POList";
import MasterItemPage from "../../pages/distro-po/MasterItem";
import DistroPOIncentive from "../../pages/distro-po/MasterIncentive";
import POSummary from "../../pages/distro-po/POSummary";
import POReport from "../../pages/distro-po/POReport";
import RequireAuth from "../../middleware/RequireAuth";
import DistroPOLayout from "../../layouts/DistroPOLayout";
import GuestOnly from "../../middleware/GuestOnly";
import Login from "../../pages/public/auth/Login";
import Register from "../../pages/public/auth/Register";
import DashboardLayout from "../../layouts/DashboardLayout";
import RegisterOtp from "../../pages/public/auth/RegisterOtp";
import LoginOtp from "../../pages/public/auth/LoginOtp";
import ResetPassword from "../../pages/public/auth/ResetPassword";

// PUBLIC
export const DistroPoRoutes = [
  {
    path: "/distro-po",
    element: <DistroPOLayout />,
    children: [
      { index: true, element: <DistroPoLandingPage /> },

      { path: "login", element: <GuestOnly><Login /></GuestOnly> },
      { path: "login-otp", element: <GuestOnly><LoginOtp /></GuestOnly> },
      { path: "reset-password", element: <ResetPassword />},

      { path: "register", element: <GuestOnly><Register /></GuestOnly> },
      { path: "register-otp", element: <GuestOnly><RegisterOtp /></GuestOnly> },

      { path: "landing2", element: <DistroPoLandingPage2 /> },
      { path: "incentive", element: <DistroPOIncentive /> },
      { path: "report", element: <RequireAuth><POSummary /></RequireAuth> },
      { path: "achievement-report", element: <RequireAuth><POReport /></RequireAuth> },
    ],
  },
];


          // element: <RequireAuth><DashboardLayout /></RequireAuth>,
export default DistroPoRoutes;
