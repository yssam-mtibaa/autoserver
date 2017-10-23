# Dev server

First `npm install`.

Then start the test server with either:
  - `npm start`: production mode
  - `npm run watch`: dev mode.
    Auto-reloads, using [Nodemon](https://github.com/remy/nodemon).
    Allows debugging in Chrome developer tools, using `node --inspect`.
  - `npm run debug`: like `npm start` but using `node --inspect-brk`,
    i.e. will put a breakpoint on server start.

A local HTTP server will be spawned at `http://localhost:5001`.

To learn how to query the API, please see this [documentation](docs/graphql.md).

# Testing

There is no automated testing yet.

`npm test` will run linting, using [ESLint](http://eslint.org/)
for general linting,
and also checking code duplication.

# Coding style

We follow the [standard JavaScript style](https://standardjs.com), except
for semicolons and trailing commas.

Additionally, we enforce a pretty strong functional programming style with
[ESLint](http://eslint.org/), which includes:
  - no complex or big functions
  - no OOP
  - immutability everywhere
  - pure functions
  - no complex loops or structures

Also we prefer:
  - named arguments over positional
  - async/await over raw promises or callbacks
  - `...object` over `Object.assign()`

# Tooling

We are using [editorconfig](http://editorconfig.org/),
so please install the plugin for your IDE.

# Troubleshooting

  - Please use Node.js v8.7.0

# Terminology

See [here](docs/terminology.md)