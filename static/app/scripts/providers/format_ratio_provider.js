'use strict';
(function(){
  goog.provide('format_ratio_provider');

  var module = angular.module('format_ratio_provider', []);

  module.provider('FormatRatioProvider', function(){

    var A4_width_mm = 210;
    var A4_height_mm = 297;

    var formats = {
      A4:{
        portrait: {
          width: A4_width_mm,
          height: A4_height_mm
        },
        landscape: {
          width: A4_height_mm,
          height: A4_width_mm
        }
      },
      A3: {
        portrait: {
          width: A4_height_mm,
          height: A4_width_mm * 2
        },
        landscape: {
          width: A4_width_mm * 2,
          height: A4_height_mm
        }
      },
      A2: {
        portrait: {
          width: A4_width_mm * 2,
          height: A4_width_mm * 2
        },
        landscape: {
          width: A4_height_mm * 2,
          height: A4_width_mm * 2
        }
      },
      A1: {
        portrait: {
          width: A4_height_mm * 2,
          height: A4_width_mm * 4
        },
        landscape: {
          width: A4_width_mm * 4,
          height: A4_height_mm * 2
        }
      },
      A0: {
        portrait: {
          width: A4_width_mm * 4,
          height: A4_height_mm * 4
        },
        landscape: {
          width: A4_height_mm * 4,
          height: A4_width_mm *4
        }
      }
    }

    function _computeRatio(format){
      return format === 'portrait' ? Math.sqrt(2) : 1/Math.sqrt(2); 
    };

    function computeTargetLat(startLatLng, endLatLng, format){
      var west = startLatLng.lng;
      var north = startLatLng.lat;
      var east = endLatLng.lng;
      var ratio = _computeRatio(format);
      
      return north - ratio * (east - west) * 
      Math.cos(north * L.LatLng.DEG_TO_RAD);
    };

    this.$get = function(){
      return {
        getRatioLatLandscape: function(startLatLng, endLatLng){
          return computeTargetLat(startLatLng, endLatLng, 'landscape');
        },
        getRatioLatPortrait: function(startLatLng, endLatLng){
          return computeTargetLat(startLatLng, endLatLng, 'portrait');
        },
        formats: formats
      }
    }
  });
})();