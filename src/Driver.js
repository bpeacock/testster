var cookies = require('browser-cookies'),
    Assert = require('./Assert'),
    log     = require('./log');

var Driver = function(stepNum, onFinished) {
  this.onFinished = onFinished;
  this.stack = [];
  this.stepNum = stepNum || 0;
  this.assert = new Assert(this);
};

Driver.prototype = {
  open: function(url) {
    var self = this;

    this.stack.push(function(next) {
      if(typeof url == 'function') {
        url = url();
      }

      if(!cookies.get('currentStepNum')) {
        cookies.set('currentStepNum', self.stepNum + '');
        log.saveStats();
        window.location = url;
      }
      else {
        cookies.erase('currentStepNum');

        $(function() {
          next();
        });
      }
    });

    return this;
  },
  reload: function() {
    var self = this;

    this.stack.push(function(next) {
      if(!cookies.get('currentStepNum')) {
        cookies.set('currentStepNum', self.stepNum + '');
        log.saveStats();
        window.location.reload();
      }
      else {
        cookies.erase('currentStepNum');

        $(function() {
          next();
        });
      }
    });

    return this;
  },
  back: function() {
    var self = this;

    this.stack.push(function(next) {
      if(!cookies.get('currentStepNum')) {
        cookies.set('currentStepNum', self.stepNum + '');
        log.saveStats();
        window.history.back();
      }
      else {
        cookies.erase('currentStepNum');

        $(function() {
          next();
        });
      }
    });

    return this;
  },
  click: function(selector) {
    this.stack.push(function(next) {
      var $item = $(selector + ':visible');

      if($item.length === 0) {
        log.error("'" + selector + "' not found.");
      }
      else {
        log.action('Click: ' + selector);
        $item[0].click();
      }

      next();
    });

    return this;
  },
  type: function(selector, string) {
    this.stack.push(function(next) {
      log.action('Type "' + string + '" in ' + selector);

      var $item = $(selector + ':visible');

      if($item.length === 0) {
        log.error("'" + selector + "' not found.");
      }
      else if($item.length > 1) {
        log.error("'" + selector + "' returns multiple.");
      }
      else {
        $item.val(string);
      }

      next();
    });

    return this;
  },
  setValue: function(selector, value) {
    this.stack.push(function(next) {
      log.action('Set Value "' + value + '" in ' + selector);

      var $item = $(selector + ':visible');

      if($item.length === 0) {
        log.error("'" + selector + "' not found.");
      }
      else if($item.length > 1) {
        log.error("'" + selector + "' returns multiple.");
      }
      else {
        if(typeof value == 'function') {
          value = value();
        }
        else if(typeof value == 'number') {
          value = $item.find('option')[value].value;
        }

        $item.val(value).change();
      }

      next();
    });

    return this;
  },
  wait: function(time) {
    this.stack.push(function(next) {
      log.action('Wait ' + time);

      setTimeout(function() {
        next();
      }, time);
    });

    return this;
  },
  waitFor: function(selector) {
    this.stack.push(function(next) {
      log.action('Waiting for ' + selector + '...');
      trySelector();

      function trySelector() {
        if($(selector).length) {
          next();
        }
        else {
          setTimeout(trySelector, 100);
        }
      }
    });

    return this;
  },
  done: function() {
    var self = this;

    this.stack[this.stepNum](function() {
      self.stepNum++;

      if(self.stepNum < self.stack.length) {
        self.done();
      }
      else {
        log.blank();
        self.onFinished();
      }
    });
  },
  execute: function(action, msg) {
    this.stack.push(function(next) {
      log.action('Executing...' || msg);
      action();
      next();
    });

    return this;
  },
  log: function(msg) {
    this.stack.push(function(next) {
      log.action(msg);
      next();
    });

    return this;
  },
  suppressLogs: function() {
    this.stack.push(function(next) {
      cookies.set('suppressLogs', 'true');
      next();
    });

    return this;
  },
  allowLogs: function() {
    this.stack.push(function(next) {
      cookies.erase('suppressLogs');
      next();
    });

    return this;
  }
};

module.exports = Driver;
