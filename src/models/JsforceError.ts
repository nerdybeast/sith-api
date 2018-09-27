import { ErrorCode } from './enums/error-code';

export class JsforceError extends Error {

	errorCode: ErrorCode;

	constructor(errorCode: ErrorCode, message: string) {
		super(message);
		this.errorCode = errorCode;
	}
}