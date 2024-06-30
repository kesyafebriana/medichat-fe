class Cookies {
	constructor() {}

	save(key: string, value: string, maxAge: number = 60 * 60 * 1) {
		document.cookie = `${key}=${value};max-age=${maxAge};path=/`;
	}

	get(key: string) {
		return document.cookie
			.split("; ")
			.find((s) => s.startsWith(`${key}=`))
			?.split("=")[1];
	}

	delete(key: string) {
		document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
	}
}

const CookiesService = new Cookies();
export default CookiesService;
