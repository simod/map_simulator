'use strict';
(function(){
  goog.provide('format_ratio_provider');

  var module = angular.module('format_ratio_provider', []);

  module.provider('FormatRatioProvider', function(){

    function _computeRatio(format){
      return format === 'portrait' ? Math.sqrt(2) : 1/Math.sqrt(2); 
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
        getLatLandscape: function(startLatLng, endLatLng){
          return computeTargetLat(startLatLng, endLatLng, 'landscape');
        },
        getLatPortrait: function(startLatLng, endLatLng){
          return computeTargetLat(startLatLng, endLatLng, 'portrait');
        }
      }
    }
  });
})();