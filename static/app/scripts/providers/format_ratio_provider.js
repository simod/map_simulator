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

  function _deg_length(p1, p2) {
      var deglen = 111.12 * L.LatLng.RAD_TO_DEG;
      var p1lat = p1.lat * L.LatLng.DEG_TO_RAD,
          p1lng = p1.lng * L.LatLng.DEG_TO_RAD,
          p2lat = p2.lat * L.LatLng.DEG_TO_RAD,
          p2lng = p2.lng * L.LatLng.DEG_TO_RAD;
      return deglen * Math.acos(Math.sin(p1lat) * Math.sin(p2lat) +
          Math.cos(p1lat) * Math.cos(p2lat) * Math.cos(p2lng - p1lng));
    };

    function _get_scale_from_bounds(bounds, format, orientation){
      // Calculate the degree lenght in the center of the rectangle
      var lat = bounds.getCenter().lat;
      var avg_west = L.latLng(lat, bounds.getNorthWest().lng);
      var avg_east = L.latLng(lat, bounds.getNorthEast().lng);
      var deg_length = _deg_length(avg_west, avg_east);
      var width__km = formats[format][orientation].width / 1000000;
      return deg_length / width__km;
    };

    function _computeRatio(format){
      return format === 'portrait' ? Math.sqrt(2) : 1/Math.sqrt(2); 
    };

    function computeTargetLat(startLatLng, endLatLng, format){
      var west = startLatLng.lng;
      var north = startLatLng.lat;
      var east = endLatLng.lng;
      var ratio = _computeRatio(format);
      
      return north - ratio * (east - west) * 
      Math.cos(Math.abs(north * L.LatLng.DEG_TO_RAD));
    };

    this.$get = function(){
      return {
        getRatioLatLandscape: function(startLatLng, endLatLng){
          return computeTargetLat(startLatLng, endLatLng, 'landscape');
        },
        getRatioLatPortrait: function(startLatLng, endLatLng){
          return computeTargetLat(startLatLng, endLatLng, 'portrait');
        },
        getScale: function(layer, format, orientation){
          var orientation = orientation || 'landscape';
          return _get_scale_from_bounds(layer.getBounds(), format, orientation);
        }
      }
    }
  });
})();