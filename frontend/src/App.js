import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CallForPapers from './pages/CallForPapers';
import SubmissionsPortal from './pages/SubmissionsPortal';
import PeerReview from './pages/PeerReview';
import ScheduleAndAgenda from './pages/ScheduleAndAgenda';
import RegistrationAndTicketing from './pages/RegistrationAndTicketing';
import VirtualConference from './pages/VirtualConference';
import Mentorship from './pages/Mentorship';
import CareerDevelopment from './pages/CareerDevelopment';
import ContactUs from './pages/ContactUs';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import JoinLiveSession from './pages/JoinLiveSession';
import ChatPage from './pages/Chat';
import PaymentForm from './pages/PaymentForm';
import AdminDashboard from './pages/AdminDashboard'; // Adjust the import path accordingly

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const storedRole = localStorage.getItem('role');
    setIsLoggedIn(loggedInStatus);
    setRole(storedRole);
  }, []);

  // Pages where the Navbar should be hidden
  const hideNavbarRoutes = ['/registration-and-ticketing', '/paymentform', '/login'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  // Define allowed routes for speakers
  const speakerRoutes = [
    { path: '/virtual-conference', element: <VirtualConference /> },
    { path: '/chat', element: <ChatPage /> },
    { path: '/join-live-session/:conferenceType/:id', element: <JoinLiveSession /> }
  ];

  // Define all routes for general users
  const generalRoutes = [
    { path: '/home', element: <Home /> },
    { path: '/call-for-papers', element: <CallForPapers /> },
    { path: '/submissions', element: <SubmissionsPortal /> },
    { path: '/peer-review', element: <PeerReview /> },
    { path: '/schedule-and-agenda', element: <ScheduleAndAgenda /> },
    { path: '/registration-and-ticketing', element: <RegistrationAndTicketing /> },
    { path: '/virtual-conference', element: <VirtualConference /> },
    { path: '/career-development', element: <CareerDevelopment /> },
    { path: '/mentorship', element: <Mentorship /> },
    { path: '/contact-us', element: <ContactUs /> },
    { path: '/join-live-session/:conferenceType/:id', element: <JoinLiveSession /> },
    { path: '/chat', element: <ChatPage /> },
    { path: '/paymentform', element: <PaymentForm /> },
  ];

  // Filter routes based on the role
  const filteredRoutes = (() => {
    switch (role) {
      case 'admin':
        return [
          { path: '/admin-dashboard', element: <AdminDashboard /> },
          { path: '/chat', element: <ChatPage /> },
        ];
      case 'speaker':
        return speakerRoutes;
      default:
        return generalRoutes;
    }
  })();

  return (
    <div>
      {!shouldHideNavbar && isLoggedIn && (
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          role={role}
          setRole={setRole}
        />
      )}
      {!shouldHideNavbar && !isLoggedIn && (
        <div className="auth-buttons">
          <Link to="/login" className="login-button">
            Login
          </Link>
          <Link to="/register" className="register-button">
            Register
          </Link>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />
        <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />

        {filteredRoutes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
      <Footer />
    </div>
  );
};


const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
