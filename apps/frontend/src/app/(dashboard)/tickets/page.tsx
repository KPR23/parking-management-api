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
import { useTickets } from "@/hooks/use-tickets";

export default function TicketsPage() {
	const [inputValue, setInputValue] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const {
		data: tickets,
		isLoading,
		error,
	} = useTickets(searchQuery, { enabled: !!searchQuery });

	const handleSearch = () => {
		setSearchQuery(inputValue);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
			</div>

			<div className="flex items-center gap-2 max-w-sm">
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by Ticket ID or Plate Number..."
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
					{error instanceof Error ? error.message : "Error loading tickets"}
				</div>
			)}

			{isLoading && searchQuery ? (
				<div>Loading...</div>
			) : (
				<div className="rounded-md border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Ticket ID</TableHead>
								<TableHead>Plate Number</TableHead>
								<TableHead>Entry Time</TableHead>
								<TableHead>Exit Time</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tickets?.map((ticket) => (
								<TableRow key={ticket.id}>
									<TableCell className="font-medium">#{ticket.id}</TableCell>
									<TableCell>{ticket.car?.plateNumber || "Unknown"}</TableCell>
									<TableCell>
										{format(new Date(ticket.entryTime), "PP p")}
									</TableCell>
									<TableCell>
										{ticket.exitTime
											? format(new Date(ticket.exitTime), "PP p")
											: "-"}
									</TableCell>
									<TableCell>
										{ticket.totalAmount
											? `${ticket.totalAmount.toFixed(2)} PLN`
											: "-"}
									</TableCell>
									<TableCell>
										<Badge variant={ticket.isPaid ? "default" : "secondary"}>
											{ticket.isPaid ? "Paid" : "Active"}
										</Badge>
									</TableCell>
								</TableRow>
							))}
							{tickets?.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center py-8 text-muted-foreground"
									>
										{searchQuery
											? "No tickets found matching your search."
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
