import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

/**
 * AuthProvider component
 * The token that is provided by the backend is stored in the local storage to
 * keep the user logged in. The token is then used to verify the user's
 * authentication status when accessing protected routes.
 */
export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	// stores user data
	const [user, setUser] = useState(null);

	// Check if user is authenticated
	useEffect(() => {
		// Check for token in localStorage
		const token = localStorage.getItem("token");
		if (token) {
			verifyToken(token);
		} else {
			setIsAuthenticated(false);
		}
	}, []);

	const login = async (credentials: LoginCredentials) => {
		try {
			const { token, user } = await authService.login(credentials);
			localStorage.setItem("token", token);
			setUser(user);
			setIsAuthenticated(true);
			return true;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		setIsAuthenticated(false);
	};

	const verifyToken = async (token: string) => {
		try {
			const { user } = await authService.verifyToken(token);
			setUser(user);
			setIsAuthenticated(true);
		} catch {
			localStorage.removeItem("token");
			setUser(null);
			setIsAuthenticated(false);
		}
	};

	// Provide the authentication context to the app
	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
