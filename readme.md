USAGE:

Run Server With hot module reloading.
```
webpack-dev-server --hot --inline
```
or
```
npm start
```

allow other devices on the network to see your server
1. get ip address of host machine
2. run
```
npm start -- --host 0.0.0.0
```
3. brows i yourip:3000 on guest device
4. enjoy testing 

Package files
```
webpack
```

Save NPM Dependencies
```
npm shrinkwrap
```
creates npm-shrinkwrap.json file.
https://docs.npmjs.com/cli/shrinkwrap
