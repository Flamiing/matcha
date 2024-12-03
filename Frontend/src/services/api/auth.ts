import apiRequest from "./config";

interface RegisterData {
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
}

// Authentication service methods
export const authApi = {
	// Register a new user
	register: async (userData: RegisterData) => {
		return apiRequest("auth/register", {
			method: "POST",
			body: JSON.stringify(userData),
		});
	},

	// Log in a user
	login: async (username: string, password: string) => {
		return apiRequest("auth/login", {
			method: "POST",
			body: JSON.stringify({ username, password }),
		});
	},

	// Check if user is authenticated
	checkAuth: async () => {
		try {
			await apiRequest("auth/verify");
			return true;
		} catch {
			return false;
		}
	},
};

export default authApi;
