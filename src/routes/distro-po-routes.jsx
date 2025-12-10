import DistroPoLandingPage from "../pages/distro-po/landingPage";
import PublicLayout from "../layouts/PublicLayout";
import DistroPoLandingPage2 from "../pages/distro-po/landing2";
import DistributorPOForm from "../pages/distro-po/form";
import POList from "../pages/distro-po/POList";
import MasterItemPage from "../pages/distro-po/MasterItem";

const DistroPoRoutes = [{
    path: "/distro-po",
    element: <PublicLayout />,
    children: [
      { index: true, element: <DistroPoLandingPage /> },
      {
          path: "landing2",
          element: <DistroPoLandingPage2 />,
       },
      {
        path: "form",
        element: <DistributorPOForm />,
      },
      {
        path: "form/:id",
        element: <DistributorPOForm />,
      },
      {
        path: "list",
        element: <POList />,
      }
      ,{
        path: "masteritem",
        element: <MasterItemPage />,
      }
  ],
}];

export default DistroPoRoutes;
