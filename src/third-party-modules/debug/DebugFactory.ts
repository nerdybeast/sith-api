import { Injectable, Inject } from "@nestjs/common";
import Debug from 'debug';
import { DebugService } from "./DebugService";

@Injectable()
export class DebugFactory {

	private debug: typeof Debug;

	constructor(@Inject('debug') debug: typeof Debug) {
		this.debug = debug;
	}

	public create(name: string) : DebugService {
		return new DebugService(name, this.debug);
	}
}