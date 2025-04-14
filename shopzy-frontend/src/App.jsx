import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from '../Pages/Login'
import SignupPage from '../Pages/SignupPage'
import CodeVerificationPage from '../Pages/CodeVerficationPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<CodeVerificationPage />} />

      </Routes>
    </Router>
  );

}

export default App
