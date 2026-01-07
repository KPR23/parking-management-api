const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	async get<T>(endpoint: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`);
		if (!response.ok) {
			let errorMessage = `API Error: ${response.statusText}`;
			try {
				const errorData = await response.json();
				if (errorData.message) {
					errorMessage = errorData.message;
				}
			} catch (e) {
				// Ignore JSON parse error, use default message
			}
			throw new Error(errorMessage);
		}
		return response.json();
	}

	async post<T>(endpoint: string, data: any): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error(`API Error: ${response.statusText}`);
		}
		return response.json();
	}

	async put<T>(endpoint: string, data: any): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error(`API Error: ${response.statusText}`);
		}
		return response.json();
	}

	async delete<T>(endpoint: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "DELETE",
		});
		if (!response.ok) {
			throw new Error(`API Error: ${response.statusText}`);
		}
		return response.json();
	}
}

export const api = new ApiClient(API_URL);
