const API_VERSION = import.meta.env.API_VERSION || "1";
const API_BASE_URL = `http://localhost:3001/api/v${API_VERSION}`;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
	// Always include credentials for cookie handling
	const finalOptions: RequestInit = {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	};

	const response = await fetch(`${API_BASE_URL}/${endpoint}`, finalOptions);

	if (!response.ok) {
		throw new Error("Request failed");
	}

	return response.json();
}

export default apiRequest;
