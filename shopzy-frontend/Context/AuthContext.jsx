// AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState(null);
    const [profileImage, setProfileImage] = useState("");

    // Load token and decode to get user details
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        console.log("Stored token from localStorage:", storedToken);  // Debugging log

        if (storedToken) {
            setToken(storedToken);

            try {
                const decoded = jwtDecode(storedToken);
                console.log("Decoded user data:", decoded);  // Debugging log
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

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setRole(null);
        setIsAdmin(false);
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, role, isAdmin, username, profileImage, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
