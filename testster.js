var cookies = require('browser-cookies'),
    Driver  = require('./src/Driver'),
    log     = require('./src/log');

$(function() {
  if(cookies.get('currentTestNum')) {
    log.loadStats();
    window.testster.run(cookies.get('currentModule'), parseInt(cookies.get('currentTestNum')), parseInt(cookies.get('currentStepNum')));
  }
});

window.testster = {
  modules: {},
  run: function(module, testNum, stepNum) {
    if(typeof testNum == 'undefined') {
      testNum = 0;
      window.testster.reset();

      if(!module) {
        cookies.set('runningAllModules', 'true');
      }
    }

    if(cookies.get('runningAllModules')) {
      runNextModule();

      function runNextModule(moduleNum) {
        var moduleNum = moduleNum || parseInt(cookies.get('currentModuleNum')) || 0,
            testNum   = parseInt(cookies.get('currentTestNum')) || 0,
            stepNum   = parseInt(cookies.get('currentStepNum')) || 0;

        if(moduleNum < Object.keys(window.testster.modules).length) {
          var module = Object.keys(window.testster.modules)[moduleNum];

          cookies.set('currentModule', module);
          cookies.set('currentModuleNum', moduleNum + '');

          if(!cookies.get('currentTestNum')) {
            log.h1('MODULE: ' + module);
          }

          runModule(module, testNum, stepNum, function() {
            cookies.erase('currentTestNum');
            cookies.erase('currentStepNum');
            runNextModule(moduleNum + 1);
          });
        }
        else {
          log.blank();
          log.stats();
          window.testster.reset();
        }
      }
    }
    else {
      if(!cookies.get('currentModule')) {
        log.blank();
        log.h1('MODULE: ' + module);
        cookies.set('currentModule', module);
      }

      runModule(module, testNum, stepNum, function() {
        log.stats(module);
        window.testster.reset();
      });
    }

    function runModule(module, testNum, stepNum, callback) {
      runTest(window.testster.modules[module], testNum, stepNum, callback);

      function runTest(module, testNum, stepNum, callback) {
        stepNum  = stepNum  || 0;
        callback = callback || function() {};

        var testName = Object.keys(module)[testNum];

        if(testName) {
          if(!cookies.get('currentStepNum')) {
            log.h2('TEST: ' + testName);
          }

          cookies.set('currentTestNum', testNum + '');

          module[testName](new Driver(stepNum, function() {
            runTest(module, testNum + 1, 0, callback);
          }));
        }
        else {
          cookies.erase('currentTestNum');
          callback();
        }
      }
    }
  },
  reset: function() {
    log.resetStats(window.testster.modules);
    cookies.erase('currentModule');
    cookies.erase('currentModuleNum');
    cookies.erase('currentTestNum');
    cookies.erase('currentStepNum');
    cookies.erase('suppressLogs');
    cookies.erase('runningAllModules');
  }
};

module.exports = function(modules) {
  window.testster.modules = modules;
  return window.testster;
}
