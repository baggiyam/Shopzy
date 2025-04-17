import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../Pages/Login';
import SignupPage from '../Pages/SignupPage';
import CodeVerificationPage from '../Pages/CodeVerficationPage';
import Home from '../Pages/Home';
import ForgotPasswordPage from '../Pages/forgotpassword';
import ResetPasswordPage from '../Pages/ResetPasswordPage';
import SearchResults from '../Pages/SearchResults';
import Cart from '../Pages/Cart';
import Wishlist from '../Pages/Wishlist';
import { AuthContext } from '../Context/AuthContext';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function App() {
  // Get the context values (token and logout) inside the App component
  const { token, logout } = useContext(AuthContext);

  return (

    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<CodeVerificationPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
      <Footer />
    </Router>

  );
}

export default App;
