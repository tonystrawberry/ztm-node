# Complete NodeJS Developer - Notes
## Node.js Fundamentals

Node.JS REPL stands for Read, Eval, Print Loop.

```
Browser:
- window
- document
- history
- location
- navigator

NodeJS:
- global
- process
- module
- __filename
- require()
```

V8 is what lets NodeJS run Javascript.
But there is also NodeJS API and additional functions like 'fs', 'http', 'path' or 'crypto'.
Then, there is the NodeJS bindings that binds NodeJS functionalities with libuv which is a deeper library written in C++. libuv is the library that talks directly to the operating system and that does all the low level operations.

libuv makes it so that NodeJS can work in any operation system.

NodeJS is good for handling asynchronous tasks. Javascript is a single threaded language. Then how?
NodeJS runs one main thread that runs the V8 engine but the asynchronous operations are implemented in native code that may use native OS threads to 'simulate' an asynchronous architecture.
It's thanks to the Event Loop. All the asynchronous code is sent to the Event Loop handled by libuv.

The Event Loop processes operation when there is any callback in the callback queue.

## Module System
CommonJS -> Standard created in 2009
```
// index.js
const module = require('module');
const customModule = require('./customModule'); // no need to specify .js extension in case of javascript files

customModule.VARIABLE;
customModule.function();

// customModule.js
module.exports = {
  VARIABLE,
  function()
}
```

ECMAScript - Standard created in 2015 - followed by the browsers but also supported by Node
```
import * as module from 'module.js';
```

Modules are cached so even if you require the same module several times, it will be 'required' only once.

## Package Management
The node_modules folder contains all the modules and makes sure there is no duplicates in case many packages are dependent of the same module.

Semantic Versioning: https://semver.org/

Never includes node_modules in git but includes package-lock.json to make sure anyone can reproduce the same environment.

## NASA Project
http://localhost:3000 -> GET -> http://localhost:8000 is by default blocked by the browser because of CORS.
CORS Middleware to enable cross-origin requests for a whitelist.

Separate Model with Controllers & Routes. But it is okay to have Controllers & Routes in the same folder because of the 1-to-1 relationship.

## Testing APIs
Using Jest: https://jestjs.io/

## Improving Node Performance
Take advantage of the NodeJS Cluster Module which allows to run multiple instances of our server on the cores of the machine.
Better use PM2 for that: https://pm2.keymetrics.io/
It distributes the load (requests) automatically and has options for monitoring the clusters and allowing zero downtime restart.

```
pm2 start src/server.js -i max
```

For compute-intensive tasks, use worker threads. Each worker will be responsible for a task inside the same process. This prevents heavy tasks from blocking the main thread.

## Database
Using MongoDB and Moongoose: https://cloud.mongodb.com/v2/621cb66ddfcb2447f2c0e1ed

mongooose-paginate for pagination when using MongoDB: https://github.com/aravindnc/mongoose-paginate-v2#readme

Pagination is good for reducing workload.

## API Versioning
It's good practice to version our API so that when we want to update it, we can also leave the old API available for our current users.
```
https://localhost:8000/launches -> https://localhost:8000/v1/launches

// api.js
const express = require('express');

const planetsRouter = require('./planets/planets.router');

const api = express.Router();

api.use('/planets', planetsRouter);

module.exports = api;

// app.js
const api = require('./routes/api');
app.use('/v1', api);
app.use('/v2', v2Api); // when v2 is available

```

## Node Security + Authentication
HTTPS encrypts data in transit!
It uses a digital certificate.
```
Used to verify the server's ownership prior to sending encrypted data.
```
Provided by a certificate authority (trusted organization) like Let's Encrypt.

We can use self-signed certificate for enabling HTTPS but not trusted by others.
But on production environment, necessary to use a CA-signed certificate.

```
const fs = require('fs');

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}, app).listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

```

Use OpenSSL to generate self-signed certificate on local machine.

```
$ openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
```

Results: two files, key.pem & cert.pem

### Helmet.js
Nice package for security Express apps by setting various HTTP headers.
For example `X-Powered-By: Express` would be removed. And it can add other headers such as Strict-Transport-Security to

### JWT Tokens
JWT Tokens include data, the payload which contains custom fields and useful information: https://jwt.io/
Tokens are composed of 3 parts: header (algorithm & token type), payload (custom data), verify signature (to verify if the data has not been tampered by any malicious third party).

### OAuth
Keeps third-party password safe by going through the official portal instead of inputting directly our third-party credentials on an untrusted website.

- Resource Owner (the user)
- Client (www.myapp.com)
- Resource Server (api.myapp.com)
- Authorization Server (accounts.google.com)

**Authorization Code Flow**
https://developer.okta.com/docs/concepts/oauth-openid/#authorization-code-flow

### Cookie-based Authentication
- https://stackoverflow.com/questions/17000835/token-authentication-vs-cookies#:~:text=A%20Token%20can%20be%20given,browser%20(by%20the%20browser)

- https://www.youtube.com/watch?v=ZSbvMhkfMYE

```
Pros:
- Cookies can be marked as "http-only" which makes them impossible to be read on the client side. This is better for XSS-attack protection.
- Comes out of the box - you don't have to implement any code on the client side.

Cons:
-Bound to a single domain. (So if you have a single page application that makes requests to multiple services, you can end up doing crazy stuff like a reverse proxy.)
- Vulnerable to XSRF. You have to implement extra measures to make your site protected against cross site request forgery.
Are sent out for every single request, (even for requests that don't require authentication).
```