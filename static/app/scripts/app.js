'use strict';
(function(){

  goog.provide('mapper');

  goog.require('map_controller');
  goog.require('feature_controller');
  goog.require('upload_controller');
  goog.require('upload_directive');
  

  var module = angular.module('mapper', [
    'map_controller',
    'feature_controller',
    'upload_controller',
    'upload_directive'
  ]);
})();

