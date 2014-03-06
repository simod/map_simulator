'use strict';
(function(){

  goog.provide('mapper');

  goog.require('map_controller');
  goog.require('feature_controller');
  

  var module = angular.module('mapper', [
    'map_controller',
    'feature_controller'    
  ]);
  // Configure general ajax parameters
  module.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
})();

