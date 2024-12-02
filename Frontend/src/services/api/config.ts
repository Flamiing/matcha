const API_VERSION = import.meta.env.API_VERSION || "1";
const API_BASE_URL = `http://localhost:3001/api/v${API_VERSION}`;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
	const finalOptions: RequestInit = {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	};

	const resp = await fetch(`${API_BASE_URL}/${endpoint}`, finalOptions);

	if (!resp.ok) {
		throw new Error(resp.statusText);
	}

	return resp.json();
}

export default apiRequest;
