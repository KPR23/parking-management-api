import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Define Interface locally or add to types/index.ts.
// Adding here for now, but better in types.
// Assuming Subscription entity matches backend
export interface Subscription {
	id: number;
	type: "monthly" | "yearly" | "lifetime";
	startDate: string;
	endDate: string;
	carId: number;
	car: {
		plateNumber: string;
	};
}

export const useSubscriptions = (
	plateNumber?: string,
	options?: { enabled?: boolean }
) => {
	return useQuery({
		queryKey: ["subscriptions", plateNumber],
		queryFn: async () => {
			const data = await api.get<Subscription | Subscription[]>(
				`/subscription${plateNumber ? `?plateNumber=${plateNumber}` : ""}`
			);
			return Array.isArray(data) ? data : [data];
		},
		enabled: options?.enabled,
	});
};
