'use strict';
(function(){
  goog.provide('format_ratio_provider');

  var module = angular.module('format_ratio_provider', []);

  module.provider('FormatRatioProvider', function(){

    function _computeRatio(format){
      return format === 'A0' ?  0.5 : 1;
    };

    function computeTargetLat(startLatLng, endLatLng, format){
      var x0 = startLatLng.lng;
      var y0 = startLatLng.lat;
      var x1 = endLatLng.lng;
      var ratio = _computeRatio(format);
      
      return y0 - ratio * (x1 - x0);
    };

    this.$get = function(){
      return {
        A0: function(startLatLng, endLatLng){
          return computeTargetLat(startLatLng, endLatLng, 'A0');
        },
        A1: function(){

        }
      }
    }
  });
})();