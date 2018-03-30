const got: any = jest.genMockFromModule('got');

let responseCount;
let responseQueue;

async function handleRequest() {

	const response = responseQueue[responseCount++];

	if(!response.success) throw response.body;

	return {
		body: response.body
	};
}

got.__setResponse = function(response?: any, error?: Error) {

	if(error) {
		this.__setResponses([{
			success: false,
			body: error
		}]);

		return;
	}

	this.__setResponses([{
		success: true,
		body: response
	}]);
}

got.__setResponses = function(responses?: any[]) {
	responseQueue = responses;
	responseCount = 0;
}

got.__reset = function() {
	this.__setResponse(undefined, undefined);
	this.__setResponses(undefined);
}

got.get = handleRequest;
got.post = handleRequest;

module.exports = got;