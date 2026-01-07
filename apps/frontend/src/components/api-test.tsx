"use client";

import { useParkingLots } from "@/hooks/use-parking-lots";

export default function ApiTest() {
	const { data: parkingLots, isLoading, error } = useParkingLots();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className="p-4 border rounded">
			<h2 className="text-lg font-bold mb-4">API Integration Test</h2>
			<pre className="bg-muted p-4 rounded overflow-auto text-xs">
				{JSON.stringify(parkingLots, null, 2)}
			</pre>
		</div>
	);
}
