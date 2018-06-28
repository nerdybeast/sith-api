import Rollbar from 'rollbar';

const logger = new Rollbar({
	accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
	captureUncaught: true,
	captureUnhandledRejections: true
});

export default logger;