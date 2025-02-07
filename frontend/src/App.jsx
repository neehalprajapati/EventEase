import React from "react";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

import Layout from "./components/Layout";
import ServiceForm from "./pages/ServiceForm";
import ServiceView from "./pages/ServiceView";
import UserDashboard from "./pages/UserDashboard";
import ExploreServices from "./pages/ExploreServices";
import DisplayService from "./components/DisplayService";
import Wishlist from "./pages/Wishlist";
import ServiceDetails from "./components/ServiceDetails";

function App() {
  return (
    <div>
      <Navbar />

      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/dashboard/:userId" element={<ProtectedRoute />}>
            <Route path="" element={<Dashboard />}>
              <Route path="profile" element={<ServiceForm />} />
              <Route path="service-overview" element={<ServiceView />} />
            </Route>
          </Route>
          {/* CUSTOMER DASHBOARD */}
          <Route path="/user-dashboard/:userId" element={<ProtectedRoute />}>
            <Route path="" element={<UserDashboard />}>
              <Route path="services" element={<ExploreServices />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="service/:serviceId" element={<ServiceDetails />} />
            </Route>
          </Route>
          <Route
            path="/user-dashboard/:userId/services/book-hall"
            element={<DisplayService category="hall" />}
          />
          <Route
            path="/user-dashboard/:userId/services/book-decoration"
            element={<DisplayService category="decoration" />}
          />
          <Route
            path="/user-dashboard/:userId/services/book-catering"
            element={<DisplayService category="catering" />}
          />
        </Routes>
      </Layout>
    </div>

    //<SignupPage/>
  );
}

export default App;
