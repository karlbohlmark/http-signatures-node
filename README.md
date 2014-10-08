# Proof of concept / testing only!

Usage:

```javascript
var signature = require("signatures");

var requestParams = {
    hostname: host,
    path: '/',
    port: 8081,
    method: "POST",
    headers: {
        'content-type': 'application/json',
        'date': new Date().toUTCString(),
    }
}

var sign = signature(
    'my-key', // keyId
    '6Jj3c7lQr6dhDf4oMsYnTfrjFnwezP4GzqHlqr2heyw=', // key
    'hmac-sha256', // Hashing algorithm
    ['date', '(request-target)'] // Headers to sign
);

var signature = sign(requestParams);
requestParams.headers.authorization = signature;

var req = http.request(requestParams)
// ... etc
```