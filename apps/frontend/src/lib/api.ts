const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
	constructor(
		public message: string,
		public status: number
	) {
		super(message);
	}
}

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private getHeaders(): Record<string, string> {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("access_token");
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}
		}
		return headers;
	}

	async get<T>(endpoint: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			headers: this.getHeaders(),
		});
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
			throw new ApiError(errorMessage, response.status);
		}
		return response.json();
	}

	async post<T>(endpoint: string, data: any): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			let errorMessage = `API Error: ${response.statusText}`;
			try {
				const errorData = await response.json();
				if (errorData.message) errorMessage = errorData.message;
			} catch (e) {}
			throw new ApiError(errorMessage, response.status);
		}
		return response.json();
	}

	async put<T>(endpoint: string, data: any): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "PUT",
			headers: this.getHeaders(),
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			let errorMessage = `API Error: ${response.statusText}`;
			try {
				const errorData = await response.json();
				if (errorData.message) errorMessage = errorData.message;
			} catch (e) {}
			throw new ApiError(errorMessage, response.status);
		}
		return response.json();
	}

	async patch<T>(endpoint: string, data: any): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "PATCH",
			headers: this.getHeaders(),
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			let errorMessage = `API Error: ${response.statusText}`;
			try {
				const errorData = await response.json();
				if (errorData.message) errorMessage = errorData.message;
			} catch (e) {}
			throw new ApiError(errorMessage, response.status);
		}
		return response.json();
	}

	async delete<T>(endpoint: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "DELETE",
			headers: this.getHeaders(),
		});
		if (!response.ok) {
			let errorMessage = `API Error: ${response.statusText}`;
			try {
				const errorData = await response.json();
				if (errorData.message) errorMessage = errorData.message;
			} catch (e) {}
			throw new ApiError(errorMessage, response.status);
		}
		return response.json();
	}
}

export const api = new ApiClient(API_URL);
