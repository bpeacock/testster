var cookies = require('browser-cookies'),
    _       = require('underscore'),
    stats;

var log = {
  h1: function(msg) {
    if(!cookies.get('suppressLogs')) {
      console.log('%c' + msg, 'color: green; text-decoration: underline;');
      console.log('');
    }
  },
  h2: function(msg) {
    if(!cookies.get('suppressLogs')) {
      console.log('%c' + msg, 'color: #6600ff; text-decoration: underline;');
    }
  },
  action: function(msg) {
    if(!cookies.get('suppressLogs')) {
      console.log('%c' + msg, 'color: blue;');
    }
  },
  error: function(msg) {
    if(!cookies.get('suppressLogs')) {
      console.log('%c' + msg, 'color: red;');
    }

    stats[cookies.get('currentModule')].error.push(cookies.get('currentTestNum'));
  },
  success: function(msg) {
    if(!cookies.get('suppressLogs')) {
      console.log('%c✔ ' + msg, 'color: green;');
    }

    stats[cookies.get('currentModule')].success.push(cookies.get('currentTestNum'));
  },
  fail: function(msg) {
    if(!cookies.get('suppressLogs')) {
      console.log('%c✘ ' + msg, 'color: red;')
    }

    stats[cookies.get('currentModule')].fail.push(cookies.get('currentTestNum'));
  },
  blank: function() {
    if(!cookies.get('suppressLogs')) {
      console.log('')
    }
  },
  resetStats: function(modules) {
    stats = {};

    _.each(modules, function(tests, name) {
      stats[name] = {
        error:    [],
        success:  [],
        fail:     []
      };
    });

    cookies.erase('testStats');
  },
  stats: function(module) {
    if(module) {
      logModule(module)
    }
    else {
      _.each(stats, function(tests, name) {
        logModule(name);
      });
    }

    function logModule(name) {
      var s         = stats[name],
          errors    = _.unique(s.errors).length,
          successes = _.unique(s.success).length
          fails     = _.unique(s.fail).length,
          error     = errors ? ', '+errors+' error'+(errors.length > 1 ? 's' : '') : '';

      console.log('%c'+name+': %c'+successes+' passed, %c'+fails+' failed'+error, 'color: blue;', 'color: green;', errors || fails ? 'color: red;' : 'color: black;');
    }
  },
  saveStats: function() {
    var jsonStats = JSON.stringify(stats);

    if(jsonStats) {
      cookies.set('testStats', jsonStats);
    }
  },
  loadStats: function() {
    var cookieStats = JSON.parse(cookies.get('testStats'))

    if(cookieStats) {
      stats = cookieStats;
    }
  }
};

module.exports = log;

