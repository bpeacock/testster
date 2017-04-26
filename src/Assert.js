var log = require('./log');

var Assert = function(test) {
  this.test = test;
};

Assert.prototype = {
  title: function(string, msg) {
    this.test.stack.push(function(next) {
      var actual = $('title').text();

      if(actual == string) {
        log.success(msg || 'Title is "' + actual + '"');
      }
      else {
        log.fail('Title returned "' + actual + '" instead of "' + string + '"');
      }

      next();
    });

    return this.test;
  },
  text: function(selector, string, msg) {
    this.test.stack.push(function(next) {
      var actual = $(selector).first().text().trim();

      if(actual == string) {
        log.success(msg || selector + ' text "' + actual + '"');
      }
      else {
        log.fail(selector + ' text returned "' + actual + '" instead of "' + string + '"');
      }

      next();
    });

    return this.test;
  },
  exists: function(selector, msg) {
    this.test.stack.push(function(next) {
      if($(selector).length) {
        log.success(msg || selector + ' exists');
      }
      else {
        log.fail(msg || selector + ' does not exist');
      }

      next();
    });

    return this.test;
  },
  doesntExist: function(selector, msg) {
    this.test.stack.push(function(next) {
      if($(selector).length === 0) {
        log.success(msg || selector + ' does not exist');
      }
      else {
        log.fail(msg || selector + ' exists');
      }

      next();
    });

    return this.test;
  },
  numberOfElements: function(selector, expected, msg) {
    this.test.stack.push(function(next) {
      var actual = $(selector).length;

      if(actual == expected) {
        log.success(msg || expected + ' of ' + selector + ' found');
      }
      else {
        log.fail(msg || 'Expected ' + expected + ' and found ' + actual + ' of ' + selector);
      }

      next();
    });

    return this.test;
  },
  visible: function(selector, msg) {
    this.test.stack.push(function(next) {
      if($(selector + ':visible').length) {
        log.success(msg || selector + ' is visible');
      }
      else {
        log.fail(msg || selector + ' is not visible');
      }

      next();
    });

    return this.test;
  },
  notVisible: function(selector, msg) {
    this.test.stack.push(function(next) {
      if($(selector + ':hidden').length) {
        log.success(msg || selector + ' is not visible');
      }
      else {
        log.fail(msg || selector + ' is visible');
      }

      next();
    });

    return this.test;
  },
  val: function(selector, value, msg) {
    this.test.stack.push(function(next) {
      var actual = $(selector).val();

      if(actual == value) {
        log.success(msg || selector + ' text "' + actual + '"');
      }
      else {
        log.fail(selector + ' text returned "' + actual + '" instead of "' + value + '"');
      }

      next();
    });

    return this.test;
  },
  attr: function(selector, name, value, msg) {
    this.test.stack.push(function(next) {
      var actual = $(selector).attr(name);

      if(actual == value) {
        log.success(msg || selector + ' attribute is "' + actual + '"');
      }
      else {
        log.fail(selector + ' attribute returned "' + actual + '" instead of "' + value + '"');
      }

      next();
    });

    return this.test;
  },
  hasClass: function(selector, className, msg) {
    this.test.stack.push(function(next) {
      if($(selector).hasClass(className)) {
        log.success(msg || selector + ' has class "' + className + '"');
      }
      else {
        log.fail(selector + ' doesn\'t have "' + className + '"');
      }

      next();
    });

    return this.test;
  },
  doesntHaveClass: function(selector, className, msg) {
    this.test.stack.push(function(next) {
      if(!$(selector).hasClass(className)) {
        log.success(msg || selector + ' doesn\'t have "' + className + '"');
      }
      else {
        log.fail(selector + ' has class "' + className + '"');
      }

      next();
    });

    return this.test;
  }
};

module.exports = Assert;
