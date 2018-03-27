const got: any = jest.genMockFromModule('got');

let responseResult;
let responseError;

got.__setResponse = function(response?: any, error?: Error) {
	responseResult = response;
	responseError = error;
}

got.__reset = function() {
	this.__setResponse(undefined, undefined);
}

got.get = async () => {

	if(responseError) throw responseError;

	return {
		body: responseResult
	};
}

module.exports = got;