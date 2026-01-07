"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";

type User = {
	id: number;
	email: string;
	name: string | null;
};

type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	login: (token: string) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("access_token");
			if (!token) {
				setIsLoading(false);
				return;
			}

			try {
				const profile = await api.get<User>("/auth/profile");
				setUser(profile);
			} catch (error) {
				logout();
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	const login = async (token: string) => {
		localStorage.setItem("access_token", token);
		try {
			const profile = await api.get<User>("/auth/profile");
			setUser(profile);
			router.push("/");
		} catch (error) {
			console.error("Login error", error);
		}
	};

	const logout = () => {
		localStorage.removeItem("access_token");
		setUser(null);
		router.push("/login");
	};

	// Protect routes
	useEffect(() => {
		const isAuthRoute =
			pathname.startsWith("/login") || pathname.startsWith("/register");
		const publicRoutes: string[] = [];

		// If not loading, check auth
		if (!isLoading) {
			const token = localStorage.getItem("access_token");
			if (!token && !isAuthRoute && !publicRoutes.includes(pathname)) {
				router.push("/login"); // Redirect to login
			}
			if (token && isAuthRoute) {
				router.push("/"); // Redirect to dashboard if already logged in
			}
		}
	}, [pathname, isLoading, router]);

	return (
		<AuthContext.Provider value={{ user, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
