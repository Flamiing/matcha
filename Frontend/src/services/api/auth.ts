import apiRequest from "./config";

interface RegisterData {
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
}

interface User {
	id: string;
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	age: number | null;
	biography: string | null;
	profile_picture: string | null;
	location: string | null;
	fame: number;
	last_online: number;
	is_online: boolean;
	gender: string | null;
	sexual_preference: string | null;
}
export type { User };

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

	// Log out a user
	logout: async () => {
		return apiRequest("auth/logout", { method: "POST" });
	},

	// Check if user is authenticated
	checkAuth: async () => {
		try {
			const response = await apiRequest("auth/status");
			if (response.ok) return true;
		} catch {
			return false;
		}
		return false;
	},
};

export default authApi;
