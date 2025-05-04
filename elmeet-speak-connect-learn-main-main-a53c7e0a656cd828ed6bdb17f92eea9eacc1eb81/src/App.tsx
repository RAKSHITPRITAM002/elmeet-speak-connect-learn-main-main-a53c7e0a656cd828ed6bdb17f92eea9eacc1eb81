import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
// Import pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Meeting from "./pages/Meeting";
import MeetingNew from "./pages/MeetingNew";
import MeetingEnhanced from "./pages/MeetingEnhanced";
import PasswordReset from "./pages/PasswordReset";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import SubscriptionCheckout from "./pages/SubscriptionCheckout";
// Import contexts
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { Toaster } from "@/components/ui/toaster";
import { PollsProvider } from './contexts/PollsContext';
import { RolePlayProvider } from './contexts/RolePlayContext';
import { LanguageToolsProvider } from './contexts/LanguageToolsContext';
import { WhiteboardProvider } from './contexts/WhiteboardContext';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="709186794530-8mbat80a7d5hnipequqht1n24c5f98ld.apps.googleusercontent.com">
      <AuthProvider>
        <PollsProvider>
          <RolePlayProvider>
            <LanguageToolsProvider>
              <WhiteboardProvider>
                <SubscriptionProvider>
                  <BrowserRouter>
                    <Routes>
                    {/* Public pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                    
                    {/* Authentication pages */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/password-reset" element={<PasswordReset />} />
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* User pages */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/subscription/checkout" element={<SubscriptionCheckout />} />
                    <Route path="/meeting/:meetingId?" element={<Meeting />} />
                    <Route path="/meeting-new/:meetingId?" element={<MeetingNew />} />
                    <Route path="/meeting-enhanced/:meetingId?" element={<MeetingEnhanced />} />
                    
                    {/* Admin pages */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    
                    {/* 404 page */}
                    <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                  </BrowserRouter>
                </SubscriptionProvider>
              </WhiteboardProvider>
            </LanguageToolsProvider>
          </RolePlayProvider>
        </PollsProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
