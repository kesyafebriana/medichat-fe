export class Unauthorized extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ErrUnauthorized";
	}
}
