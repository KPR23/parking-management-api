"use client";

import { format } from "date-fns";
import { Car, Clock, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/types";

interface TicketStubProps {
	ticket: Ticket;
}

export function TicketStub({ ticket }: TicketStubProps) {
	return (
		<div className="relative group">
			{/* Perforated Top Edge Visual */}
			<div className="absolute -top-1 left-2 right-2 h-2 bg-background z-10 radial-pattern-top" />

			<Card
				className={cn(
					"relative border-0 shadow-md bg-card/50 hover:bg-card/80 transition-all duration-300 overflow-hidden",
					"before:absolute before:inset-y-4 before:-left-1.5 before:w-3 before:h-3 before:rounded-full before:bg-background before:z-10",
					"after:absolute after:inset-y-4 after:-right-1.5 after:w-3 after:h-3 after:rounded-full after:bg-background after:z-10"
				)}
			>
				<div className="p-6 flex flex-col gap-4">
					{/* Header */}
					<div className="flex justify-between items-start border-b border-dashed border-border/50 pb-4">
						<div>
							<span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
								Ticket ID
							</span>
							<h3 className="text-2xl font-mono font-bold text-foreground">
								#{ticket.id}
							</h3>
						</div>
						<Badge
							variant={ticket.isPaid ? "default" : "secondary"}
							className={cn(
								"font-mono uppercase tracking-wide",
								ticket.isPaid && "bg-green-500 hover:bg-green-600"
							)}
						>
							{ticket.isPaid ? "Paid" : "Active"}
						</Badge>
					</div>

					{/* Route Visual */}
					<div className="flex items-center gap-4 py-2">
						<div className="flex-1">
							<div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
								<Clock className="w-3 h-3" /> Entry
							</div>
							<div className="font-semibold text-sm">
								{format(new Date(ticket.entryTime), "HH:mm")}
							</div>
							<div className="text-xs text-muted-foreground">
								{format(new Date(ticket.entryTime), "MMM d, yyyy")}
							</div>
						</div>

						<div className="flex flex-col items-center flex-1">
							<div className="w-full h-px bg-border my-2 relative">
								<div className="absolute left-1/2 -top-1 w-2 h-2 rounded-full bg-primary -translate-x-1/2" />
							</div>
							<span className="text-[10px] text-muted-foreground">
								Duration
							</span>
						</div>

						<div className="flex-1 text-right">
							<div className="text-xs text-muted-foreground flex items-center justify-end gap-1 mb-1">
								Exit <Clock className="w-3 h-3" />
							</div>
							<div className="font-semibold text-sm">
								{ticket.exitTime
									? format(new Date(ticket.exitTime), "HH:mm")
									: "--:--"}
							</div>
							<div className="text-xs text-muted-foreground">
								{ticket.exitTime
									? format(new Date(ticket.exitTime), "MMM d, yyyy")
									: "In Parking"}
							</div>
						</div>
					</div>

					{/* Footer Details */}
					<div className="flex items-center justify-between pt-4 border-t border-dashed border-border/50 bg-muted/20 -mx-6 -mb-6 p-6">
						<div className="flex items-center gap-2">
							<div className="p-2 rounded-md bg-background border shadow-sm">
								<Car className="w-4 h-4 text-primary" />
							</div>
							<span className="font-mono font-bold text-lg tracking-widest">
								{ticket.car?.plateNumber}
							</span>
						</div>

						<div className="text-right">
							<span className="text-xs text-muted-foreground block">
								Total Amount
							</span>
							<span className="text-xl font-bold font-mono">
								{ticket.totalAmount
									? `${ticket.totalAmount.toFixed(2)} PLN`
									: "--.-- PLN"}
							</span>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
