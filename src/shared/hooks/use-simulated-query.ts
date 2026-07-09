import { useCallback, useEffect, useState } from "react";

export type QueryStatus = "idle" | "loading" | "success" | "error";

type UseSimulatedQueryOptions<T> = {
	enabled?: boolean;
	initialData?: T;
};

export function useSimulatedQuery<T>(
	fetcher: (signal: AbortSignal) => Promise<T>,
	deps: unknown[] = [],
	options: UseSimulatedQueryOptions<T> = {},
) {
	const { enabled = true, initialData } = options;
	const [data, setData] = useState<T | undefined>(initialData);
	const [status, setStatus] = useState<QueryStatus>(
		enabled ? "loading" : "idle",
	);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const refetch = useCallback(async () => {
		if (!enabled) return;
		setIsRefreshing(true);
		setError(null);
		const controller = new AbortController();

		try {
			const result = await fetcher(controller.signal);
			setData(result);
			setStatus("success");
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			setError(err instanceof Error ? err.message : "Something went wrong");
			setStatus("error");
		} finally {
			setIsRefreshing(false);
		}
	}, [enabled, fetcher]);

	useEffect(() => {
		if (!enabled) return;
		const controller = new AbortController();
		setStatus("loading");
		setError(null);

		fetcher(controller.signal)
			.then((result) => {
				setData(result);
				setStatus("success");
			})
			.catch((err) => {
				if (err instanceof DOMException && err.name === "AbortError") return;
				setError(err instanceof Error ? err.message : "Something went wrong");
				setStatus("error");
			});

		return () => controller.abort();
	}, [enabled, fetcher, ...deps]);

	return { data, status, error, isRefreshing, refetch };
}
