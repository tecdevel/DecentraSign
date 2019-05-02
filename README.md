# DecentraSign

This project was created during the Radix Hackathon 01 to demonstrate the use of the Radix ledger to create immutable proof of the claim of a specific file. 

When a file is uploaded, the system hashes the file, generates a deterministic account based on that hash and stores its metadata so that it can be retreived in future occasions to verify its authenticity.


## Prerequisites

[![node][node]][node-url]
[![npm][npm]][npm-url]
      
- [Node.js](http://es6-features.org)

## Start Dev Server

1. `git clone https://github.com/jluccisano/webpack-es6-boilerplate.git`
2. Run `npm install`
3. Start the dev server using `npm start`
3. Open [http://localhost:9000](http://localhost:9000)


## Commands

- `npm start` - start the dev server
- `npm run build` - create build in `dist` folder
- `npm run lint` - run an ESLint check
- `npm run coverage` - run code coverage and generate report in the `coverage` folder
- `npm test` - run all tests
- `npm run test:watch` - run all tests in watch mode

## Licence

[webpack]: https://webpack.js.org

[npm]: https://img.shields.io/badge/npm-5.3.0-blue.svg
[npm-url]: https://npmjs.com/

[node]: https://img.shields.io/node/v/webpack-es6-boilerplate.svg
[node-url]: https://nodejs.org

[tests]: http://img.shields.io/travis/jluccisano/webpack-es6-boilerplate.svg
[tests-url]: https://travis-ci.org/jluccisano/webpack-es6-boilerplate

[cover]: https://codecov.io/gh/jluccisano/webpack-es6-boilerplate/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/jluccisano/webpack-es6-boilerplate