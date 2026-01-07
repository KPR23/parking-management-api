"use client";

import { format } from "date-fns";
import { Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useSubscriptions } from "@/hooks/use-subscriptions";

export default function SubscriptionsPage() {
	const [inputValue, setInputValue] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const {
		data: subscriptions,
		isLoading,
		error,
	} = useSubscriptions(searchQuery, { enabled: !!searchQuery });

	const handleSearch = () => {
		setSearchQuery(inputValue);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
			</div>

			<div className="flex items-center gap-2 max-w-sm">
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by Plate Number or ID..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value.toUpperCase())}
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
						className="pl-8"
					/>
				</div>
				<Button onClick={handleSearch}>Search</Button>
			</div>

			{error && (
				<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
					{error instanceof Error
						? error.message
						: "Error loading subscriptions"}
				</div>
			)}

			{isLoading && searchQuery ? (
				<div>Loading...</div>
			) : (
				<div className="rounded-md border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Plate Number</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Start Date</TableHead>
								<TableHead>End Date</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{subscriptions?.map((sub) => {
								const isActive = new Date(sub.endDate) > new Date();
								return (
									<TableRow key={sub.id}>
										<TableCell className="font-medium">#{sub.id}</TableCell>
										<TableCell>{sub.car?.plateNumber || "Unknown"}</TableCell>
										<TableCell className="capitalize">{sub.type}</TableCell>
										<TableCell>
											{format(new Date(sub.startDate), "PP")}
										</TableCell>
										<TableCell>{format(new Date(sub.endDate), "PP")}</TableCell>
										<TableCell>
											<Badge variant={isActive ? "default" : "destructive"}>
												{isActive ? "Active" : "Expired"}
											</Badge>
										</TableCell>
									</TableRow>
								);
							})}
							{subscriptions?.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center py-8 text-muted-foreground"
									>
										{searchQuery
											? "No subscriptions found matching your search."
											: "Type a plate number to search."}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
