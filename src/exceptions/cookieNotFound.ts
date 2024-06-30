export class CookieNotFound extends Error {
	constructor(message: string = "cookie not found") {
		super(message);
		this.name = "ErrCookieNotFound";
	}
}
