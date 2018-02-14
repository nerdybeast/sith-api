import { ChildProcess } from 'child_process';

export abstract class PollingBase {
	fork: ChildProcess;
}