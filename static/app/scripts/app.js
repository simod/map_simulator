'use strict';
(function(){

  goog.provide('mapper');

  goog.require('map_controller');
  goog.require('feature_controller');
  

  var module = angular.module('mapper', [
    'map_controller',
    'feature_controller'    
  ]);
})();

