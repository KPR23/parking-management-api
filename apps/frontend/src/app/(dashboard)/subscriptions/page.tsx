"use client";

import { CreditCard, Search } from "lucide-react";
import { useState } from "react";
import { SubscriptionCard } from "@/components/subscription-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex flex-col gap-4">
				<h2 className="text-4xl font-bold tracking-tight font-display">
					Subscriptions
				</h2>
				<p className="text-muted-foreground text-lg max-w-2xl">
					Manage and view active parking memberships.
				</p>
			</div>

			<div className="relative max-w-xl">
				<Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
				<Input
					placeholder="Search by Plate (e.g., WA12345)..."
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value.toUpperCase())}
					onKeyDown={(e) => e.key === "Enter" && handleSearch()}
					className="pl-12 h-12 text-lg shadow-sm border-muted-foreground/20 focus-visible:border-primary transition-all rounded-xl"
				/>
				<div className="absolute right-2 top-2">
					<Button onClick={handleSearch} size="sm" className="h-8">
						Search
					</Button>
				</div>
			</div>

			{error && (
				<div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
					{error instanceof Error
						? error.message
						: "Error loading subscriptions"}
				</div>
			)}

			<div className="min-h-[400px]">
				{isLoading && searchQuery ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="aspect-[1.586/1] rounded-xl bg-muted/20 animate-pulse"
							/>
						))}
					</div>
				) : (
					<>
						{/* Results Grid */}
						{subscriptions && subscriptions.length > 0 && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
								{subscriptions.map((sub) => (
									<div
										key={sub.id}
										className="animate-in zoom-in-95 duration-300 fill-mode-backwards"
										style={{ animationDelay: `${sub.id * 50}ms` }}
									>
										<SubscriptionCard subscription={sub} />
									</div>
								))}
							</div>
						)}

						{/* Empty State / Initial State */}
						{(!subscriptions || subscriptions.length === 0) && (
							<div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/5">
								<div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-6">
									<CreditCard className="w-8 h-8 text-muted-foreground/50" />
								</div>
								<h3 className="text-xl font-semibold mb-2">
									{searchQuery ? "No subscriptions found" : "Ready to Search"}
								</h3>
								<p className="text-muted-foreground max-w-sm">
									{searchQuery
										? `We couldn't find any subscriptions for "${searchQuery}".`
										: "Enter a license plate to check membership status."}
								</p>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
