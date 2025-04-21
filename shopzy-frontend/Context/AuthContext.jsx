import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);
            try {
                const decoded = jwtDecode(storedToken);
                setUser({ id: decoded.userId, email: decoded.email });
                setRole(decoded.role);
                setIsAdmin(decoded.role === "admin");
                setUsername(decoded.username);
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        }
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (token) {
                try {
                    const res = await axios.get('/user/details', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUsername(res.data.username);
                    setProfileImage(res.data.profileImage || null);
                } catch (error) {
                    console.error("Failed to fetch user details", error);
                }
            }
        };
        fetchUserDetails();
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
        try {
            const decoded = jwtDecode(newToken);
            setUser({ id: decoded.userId, email: decoded.email });
            setRole(decoded.role);
            setIsAdmin(decoded.role === "admin");
            setUsername(decoded.username);
        } catch (error) {
            console.error("Invalid token during login", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
        setRole(null);
        setIsAdmin(false);
        setUsername(null);
        setProfileImage(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, role, isAdmin, username, profileImage, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
