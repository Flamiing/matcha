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

	const data = await resp.json();

	if (!resp.ok) {
		throw {
			status: resp.status,
			message: data.msg || "An unexpected error occurred",
		};
	}

	return data;
}

export default apiRequest;
