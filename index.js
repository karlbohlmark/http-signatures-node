var crypto = require("crypto")

module.exports = signature;

function signature(keyId, key, algorithm, headers) {
    if (typeof headers != 'string') {
	headers = headers.join(" ")
    }
    var headerArray = typeof headers == 'string' ?
	headers.split(' ') : headers;

    function hmacSignature(r) {
	function getHeaderValue(r, header) {
	    switch (header) {
		case '(request-target)':
		    return r.method.toLowerCase() + ' ' + r.path
		    break;
		default:
		    return r.headers[header];
	    }
	}

	var headerStrings = headerArray.map(function (header) {
	    return header + ": " + getHeaderValue(r, header);
	});
	var toSign = headerStrings.join('\n');
	var parts = algorithm.split('-');
	var keyBuffer = new Buffer(key, 'base64');
	var hmac = crypto.createHmac(parts[1], keyBuffer);
	hmac.update(toSign);
	return hmac.digest('base64');
    }

    function formatAuthorization(signParams) {
	var params = ["keyId", "algorithm", "headers", "signature"]
	var signParamStrings = params.map(function (p) {
	    return p + '="' + signParams[p] + '"';
	})
	return 'Signature ' + signParamStrings.join(",");
    }

    return function RequestSignature(r) {
	var signParams = {
	    keyId: keyId,
	    algorithm: algorithm,
	    headers: headers,
	    signature: hmacSignature(r)
	}
	return formatAuthorization(signParams);
    }
}