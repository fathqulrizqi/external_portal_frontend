import DashboardLayout from "../../layouts/DashboardLayout";
import DistroPoLandingPage from "../../pages/distro-po/landingPage";
import DistributorPOForm from "../../pages/distro-po/form";
import POList from "../../pages/distro-po/POList";
import POSummary from "../../pages/distro-po/POSummary";
import MasterItemPage from "../../pages/distro-po/MasterItem";
import MasterAchievementPage from "../../pages/distro-po/MasterAchievement";
import MasterItemPricePage from "../../pages/distro-po/MasterItemPricePage";
import MasterIncentivePage from "../../pages/distro-po/MasterIncentive";
import SubmittedPriceListPage from "../../pages/distro-po/SubmittedPriceListPage";
import RequireAuth from "../../middleware/RequireAuth";
import Profile from "../../pages/admin/hamburger-menu/profile";

export const DistroPoDashboardRoutes = [
  {
    path: "/distro-po/dashboard",
    element: <RequireAuth><DashboardLayout /></RequireAuth>,
    // element: <DashboardLayout />,
    children: [
      { index: true, element: <DistroPoLandingPage /> },

      { path: "form", element: <DistributorPOForm /> },
      { path: "form/:id", element: <DistributorPOForm /> },
      { path: "list", element: <POList /> },
      { path: "summary", element: <POSummary /> },
      { path: "masteritem", element: <MasterItemPage /> },
          { path: "masteritem-price", element: <MasterItemPricePage /> },
          { path: "submitted-price-list", element: <SubmittedPriceListPage /> },
      { path: "masterachievement", element: <MasterAchievementPage /> },
      { path: "profile", element: <Profile /> },
    ],
  },
];

export default DistroPoDashboardRoutes;

