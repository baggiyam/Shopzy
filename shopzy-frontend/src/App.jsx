import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from '../Pages/Login'
import SignupPage from '../Pages/SignupPage'
import CodeVerificationPage from '../Pages/CodeVerficationPage'
import Home from '../Pages/Home'
import ForgotPasswordPage from '../Pages/forgotpassword'
import ResetPasswordPage from '../Pages/ResetPasswordPage'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<CodeVerificationPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />

      </Routes>
    </Router>
  );

}

export default App
