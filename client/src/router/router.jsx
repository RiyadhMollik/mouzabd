import {
    createBrowserRouter,
  
  } from "react-router-dom";
import HomePage from "../page/HomePage";
import App from "../App";
import PackagePage from "../page/PackagePage";
import LoginPage from "../page/LoginPage";
import ResultPage from "../page/ResultPage";
import TutorialPage from "../page/TutorialPage";
import RegisterPage from "../page/RegisterPage";
import AboutUs from "../page/AboutUs";
import PrivacyPolicy from "../page/PrivacyPolicy";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../page/ProfilePage";
import MapList from "../page/MapList";
import ErrorPage from "../component/shared/ErrorPage";
import TermsConditions from "../page/TermsConditionsPage";
import CheckOutPage from "../page/CheckOutPage";
import ContactUs from "../page/ContactUs";
import SuccessPage from "../page/SucessPage";
import ForgotPasswordPage from "../page/ForgotPasswordPage";
import FaqPage from "../page/FaqPage";

// EPS Payment Pages
import PaymentSuccess from "../page/payment/PaymentSuccess";
import PaymentFailed from "../page/payment/PaymentFailed";
import PaymentCancelled from "../page/payment/PaymentCancelled";
import Checkout from "../page/payment/Checkout";

// Package Pages
import PackageSelectionPage from "../page/packages/PackageSelectionPage";
import PackageSelectionPageSimple from "../page/packages/PackageSelectionPageSimple";
import PackageSelectionPageTest from "../page/packages/PackageSelectionPageTest";
import PackageSelectionPageMock from "../page/packages/PackageSelectionPageMock";
import UserPackageDashboard from "../page/packages/UserPackageDashboard";
import UserPackageDashboardSimple from "../page/packages/UserPackageDashboardSimple";
import TestPackage from "../page/TestPackage";
import TestPrivate from "../page/TestPrivate";



  export  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
    //  errorElement: <ErrorPage/>,
children: [
        {
          path: '/',
          element: <HomePage/>,
        },
        {
          path: '/package',
          element: <PackagePage/>,
        },
        {
          path: '/login',
          element: <LoginPage/>,
        },
        {
          path: '/result',
          element: <ResultPage/>,
        },
        {
          path: '/forget-password',
          element: <ForgotPasswordPage/>,
        },

         {
          path: '/about',
          element:<AboutUs/> ,
        },
           {
          path: '/tutorial',
          element: <TutorialPage/>,
        },
        {
          path: '/register',
          element: <RegisterPage/>,
        },
        {
          path: '/privacy',
          element: <PrivacyPolicy/>,
        },
         {
          path: '/profile',
          element: <PrivateRoute><ProfilePage/></PrivateRoute>,
        },
        {
          path: '/map/list',
          element: <PrivateRoute><MapList/></PrivateRoute>,
        },
        { 
          path: '/শর্তাবলী',
          element:<TermsConditions/>
        },
        { 
          path: '/checkout',
          element:<CheckOutPage/>
        },
         { 
          path: '/contactus',
          element:<ContactUs/>
        },
        {
          path: "/success",
          element:<PrivateRoute><SuccessPage/></PrivateRoute>

        },
        { 
          path: '/faqs',
          element:<FaqPage></FaqPage>
        },
        // EPS Payment Routes
        {
          path: '/payment/success',
          element: <PaymentSuccess />
        },
        {
          path: '/payment/failed',
          element: <PaymentFailed />
        },
        {
          path: '/payment/cancelled',
          element: <PaymentCancelled />
        },
        {
          path: '/payment/checkout',
          element: <Checkout />
        },
        // Package Management Routes
        {
          path: '/packages',
          element: <PackageSelectionPage />
        },
        {
          path: '/packages/mock',
          element: <PackageSelectionPageMock />
        },
        {
          path: '/packages/full/complex',
          element: <PackageSelectionPage />
        },
        {
          path: '/packages/dashboard',
          element: <UserPackageDashboard />
        },
        

    ]
    }])