module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    reporters: ['progress', 'coverage'],
    browsers: ['ChromeHeadless'],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-coverage'
    ],

    files: [
      './node_modules/angular/angular.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './src/angular-avatax.js',
      './test/**/*.js'
    ],

    preprocessors: {
      'src/**/*.js': ['coverage']
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage'
    },


    exclude: [],

    singleRun: true
  });
};
