import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Company from "./components/company";
import Notification from "./components/notification";
import Dashboard from "./pages/dashboard/dashboard";
import HomePage from "./pages/homepage/homePage";
import Marketplace from "./pages/marketplace/marketplace";
import Onboarding from "./pages/onboarding/onboarding";
import Settings from "./pages/settings/settings";

function App() {
  return (
    <>
      <Notification />
      <Router>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<Onboarding />} path="/onboarding" />
          <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<Settings />} path="/dashboard/settings" />
          <Route element={<Marketplace />} path="/marketplace" />
          <Route element={<Company />} path="/marketplace/company/:id" />
        </Routes>
      </Router>
    </>
  );
}

export default App;
