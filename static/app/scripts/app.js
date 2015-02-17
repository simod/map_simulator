'use strict';
(function(){

  goog.provide('mapper');

  goog.require('map_controller');
  goog.require('feature_controller');
  goog.require('upload_controller');
  goog.require('upload_generic_controller');
  goog.require('upload_directive');
  

  var module = angular.module('mapper', [
    'map_controller',
    'feature_controller',
    'upload_controller',
    'upload_directive',
    'upload_generic_controller'
  ]);


  // Register a filter to round the scale for image preview
  module.filter('roundscale', function(){
    return function(scale){
      if(scale > 3000000){
        return 'high_res';
      }else{
        return 'low_res';
      }
    }
  });

  // Register a filter for deimal degree to deg minute and second conversion
  module.filter('degreeFormat', function(){
    return function(d){
      if($('#decimal_degree').prop('checked')){
        return d;
      }else{
        return [0|d, '° ', 0|(d<0?d=-d:d)%1*60, "' ", 0|d*60%1*60, '"'].join('');
      }
    }
  });
})();

