export async function fetchJson<JSON = unknown>(
	input: RequestInfo,
	init?: RequestInit
): Promise<JSON> {
	return fetch(input, {
		credentials: "include",
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
		},
		...init,
	}).then((res) => res.json());
}
