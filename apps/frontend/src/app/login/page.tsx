"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
	const { login } = useAuth();
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		setError("");
		try {
			const res = await api.post<{ access_token: string }>(
				"/auth/login",
				values
			);
			login(res.access_token);
		} catch (err: any) {
			setError(err.message || "Failed to login");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900">
			<div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-6 shadow-lg dark:bg-zinc-950 dark:border-zinc-800">
				<div className="text-center">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
						Sign in
					</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Welcome back to Parking Management
					</p>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="admin@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="******" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{error && (
							<div className="text-sm font-medium text-destructive">
								{error}
							</div>
						)}

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Sign in
						</Button>
					</form>
				</Form>
				<div className="text-center text-sm">
					Don't have an account?{" "}
					<Link href="/register" className="underline hover:text-primary">
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
}
