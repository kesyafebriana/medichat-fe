import useSWR from "swr";
import { SessionData, defaultSession } from "@/utils/session";
import { fetchJson } from "@/utils/fetcher";

interface UseSessionReturn {
	isLoading: boolean;
	session?: SessionData;
}

export default function useSession(): UseSessionReturn {
	const { data: session, isLoading } = useSWR(
		process.env.NEXT_PUBLIC_DOMAIN + "/api/sessions",
		fetchJson<SessionData>,
		{
			fallbackData: defaultSession,
		}
	);

	return {
		isLoading,
		session,
	};
}
