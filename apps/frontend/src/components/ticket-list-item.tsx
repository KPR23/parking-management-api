"use client";

import { format } from "date-fns";
import { ArrowRight, Car, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/types";

interface TicketListItemProps {
	ticket: Ticket;
}

export function TicketListItem({ ticket }: TicketListItemProps) {
	return (
		<div className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-card border rounded-lg hover:border-primary/50 transition-all shadow-sm">
			{/* Left: Status & Main Info */}
			<div className="flex items-start gap-4">
				<div
					className={cn(
						"p-2 rounded-full mt-1",
						ticket.isPaid
							? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
							: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
					)}
				>
					{ticket.isPaid ? (
						<CheckCircle2 className="w-5 h-5" />
					) : (
						<Clock className="w-5 h-5" />
					)}
				</div>
				<div>
					<div className="flex items-center gap-3">
						<span className="font-mono text-lg font-bold tracking-tight">
							{ticket.car?.plateNumber}
						</span>
						<span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
							#{ticket.id}
						</span>
					</div>
					<div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
						<span className="flex items-center gap-1">
							{format(new Date(ticket.entryTime), "PP p")}
						</span>
						{ticket.exitTime && (
							<>
								<ArrowRight className="w-3 h-3" />
								<span>{format(new Date(ticket.exitTime), "p")}</span>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Right: Amount & Badges */}
			<div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6">
				<div className="text-right">
					<div className="text-sm text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
						Total
					</div>
					<div className="font-mono font-bold text-lg">
						{ticket.totalAmount
							? `${ticket.totalAmount.toFixed(2)} PLN`
							: "Active"}
					</div>
				</div>
				<Badge
					variant="outline"
					className={cn(
						"px-2.5 py-0.5 uppercase text-[10px] tracking-wide border-0",
						ticket.isPaid
							? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
							: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
					)}
				>
					{ticket.isPaid ? "Paid" : "In Progress"}
				</Badge>
			</div>
		</div>
	);
}
