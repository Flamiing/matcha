import apiRequest from "./config";

interface RegisterData {
	username: string;
	firstName: string;
	last_name: string;
	email: string;
	password: string;
}

interface LoginData {
	username: string;
	password: string;
}

interface User {
	id: string;
	email: string;
	username: string;
	firstName: string;
	last_name: string;
	age: number | null;
	biography: string | null;
	profilePicture: string | null;
	location: string | null;
	fame: number;
	lastOnline: number;
	is_online: boolean;
	gender: string | null;
	sexualPreference: string | null;
}

interface AuthResponse {
	success: boolean;
	message: string;
	user?: User;
}

export type { User, RegisterData, LoginData, AuthResponse };

// Authentication service methods
export const authApi = {
	// Register a new user
	register: async (userData: RegisterData): Promise<AuthResponse> => {
		try {
			const response = await apiRequest("auth/register", {
				method: "POST",
				body: JSON.stringify(userData),
			});
			return response;
		} catch (error: any) {
			return {
				success: false,
				message: error.message || "Registration failed",
			};
		}
	},

	// Log in a user
	login: async (userData: LoginData): Promise<AuthResponse> => {
		try {
			const response = await apiRequest("auth/login", {
				method: "POST",
				body: JSON.stringify(userData),
			});
			return response;
		} catch (error: any) {
			return {
				success: false,
				message: error.message || "Login failed",
			};
		}
	},

	// Log out a user
	logout: async (): Promise<AuthResponse> => {
		try {
			await apiRequest("auth/logout", { method: "POST" });
			return {
				success: true,
				message: "Logout successful",
			};
		} catch (error: any) {
			return {
				success: false,
				message: error.message || "Logout failed",
			};
		}
	},

	// Check if user is authenticated
	checkAuth: async (): Promise<boolean> => {
		try {
			const response = await apiRequest("auth/status");
			return response.status === 200;
		} catch {
			return false;
		}
	},

	oauth: async (code: string): Promise<AuthResponse> => {
		try {
			const response = await apiRequest(
				`auth/oauth?code=${code}`
			);
			return response;
		} catch (error: any) {
			return {
				success: false,
				message: error.message || "OAuth failed",
			};
		}
	},
};

export default authApi;
