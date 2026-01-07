"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth"; // To check if self-deletion

type User = {
	id: number;
	email: string;
	name: string | null;
	createdAt: string;
};

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	name: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function AdminsPage() {
	const queryClient = useQueryClient();
	const [isAddOpen, setIsAddOpen] = useState(false);
	const { user: currentUser } = useAuth();

	const { data: users, isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: () => api.get<User[]>("/users"),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => api.delete(`/users/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const createMutation = useMutation({
		mutationFn: (data: RegisterForm) => api.post("/auth/register", data), // Using auth register for now
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			setIsAddOpen(false);
			form.reset();
		},
	});

	const form = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
	});

	function onSubmit(data: RegisterForm) {
		createMutation.mutate(data);
	}

	if (isLoading) {
		return <div className="p-8">Loading...</div>;
	}

	return (
		<div className="p-8 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Admins</h1>
				<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" /> Add Admin
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Admin</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
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
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name (Optional)</FormLabel>
											<FormControl>
												<Input placeholder="John Doe" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full"
									disabled={createMutation.isPending}
								>
									{createMutation.isPending && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Create Admin
								</Button>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users?.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.name || "-"}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									{new Date(user.createdAt).toLocaleDateString()}
								</TableCell>
								<TableCell className="text-right">
									<Button
										variant="ghost"
										size="icon"
										className="text-destructive hover:text-destructive hover:bg-destructive/10"
										onClick={() => {
											if (confirm("Are you sure?")) {
												deleteMutation.mutate(user.id);
											}
										}}
										disabled={
											deleteMutation.isPending || user.id === currentUser?.id
										}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
