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