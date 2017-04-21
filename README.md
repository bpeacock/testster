testster.js
===========

A simple in-browser behavior test driver. Clicks and such are simulated with javascript rather than a true browser driver that generates the native events (like selenium). While this is a somewhat less realistic testing environment, it is a hell of a lot simpler and more reliable.

Usage:
------

On each webpage to be tested, initialize testster.js and configure the test files. Assuming you are building your client-side JS with [browserify](http://browserify.org/):

```javascript
require('testster')({
  login: require('./login.test.js'),
  todos: require('./todos.test.js')
});
```

The *.test.js files are of the following format:

```javascript
module.exports = {
  'Shows sign in form': function(test) {
    test
      .open('http://localhost:3000/login')
      .waitFor('.login-form')
      .assert.title('Login')
      .assert.text('h2', 'Login')
      .done();
  },
  'User can log in': function(test) {
    test
      .open('http://localhost:3000/login')
      .waitFor('.login-form')
      .type('input[name=username]', 'testuser')
      .type('input[name=password]', 'password')
      .click('button[type=submit]')
      .waitFor('.todos-app')
      .assert.title('Todos')
      .assert.text('h2', 'My Todos')
      .done();
  }
};
```

Reference the source for a full list of [functions](https://github.com/bpeacock/testster/blob/master/src/Driver.js) and [assertions](https://github.com/bpeacock/testster/blob/master/src/Assert.js).

Running Tests
-------------

Open the javascript console on your webpage. Make sure to check "preserve log" so that the log doesn't clear when navigating between pages.

**Run all tests:** `testster.run()`

**Run a module:** `testster.run('login')`

**Stop the tests:** `testster.reset()`
