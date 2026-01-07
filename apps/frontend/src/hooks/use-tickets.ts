import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Ticket } from "@/types";

export const useTickets = (
	plateNumber?: string,
	options?: { enabled?: boolean }
) => {
	return useQuery({
		queryKey: ["tickets", plateNumber],
		queryFn: () =>
			api.get<Ticket[]>(
				`/tickets${plateNumber ? `?plateNumber=${plateNumber}` : ""}`
			),
		enabled: options?.enabled,
	});
};
