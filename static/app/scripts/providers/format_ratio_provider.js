'use strict';
(function(){
  goog.provide('format_ratio_provider');

  var module = angular.module('format_ratio_provider', []);

  module.provider('FormatRatioProvider', function(){

    // corrected by the internal map dimensions
    var A4_width_mm = 170; 
    var A4_height_mm = 279;

    var getFormats = function(width, height){
      return {
        A4:{
          portrait: {
            width: width,
            height: height
          },
          landscape: {
            width: height,
            height: width
          }
        },
        A3: {
          portrait: {
            width: height,
            height: width * 2
          },
          landscape: {
            width: width * 2,
            height: height
          }
        },
        A2: {
          portrait: {
            width: width * 2,
            height: height * 2
          },
          landscape: {
            width: height * 2,
            height: width * 2
          }
        },
        A1: {
          portrait: {
            width: height * 2,
            height: width * 4
          },
          landscape: {
            width: width * 4,
            height: height * 2
          }
        }
      }
    }

    // Taken from leaflet Scale.js
    function _deg_length(p1, p2) {
      var deglen = 111.12 * L.LatLng.RAD_TO_DEG;
      var p1lat = p1.lat * L.LatLng.DEG_TO_RAD,
          p1lng = p1.lng * L.LatLng.DEG_TO_RAD,
          p2lat = p2.lat * L.LatLng.DEG_TO_RAD,
          p2lng = p2.lng * L.LatLng.DEG_TO_RAD;
      return deglen * Math.acos(Math.sin(p1lat) * Math.sin(p2lat) +
          Math.cos(p1lat) * Math.cos(p2lat) * Math.cos(p2lng - p1lng));
    };

    // Calculate the scale for bounds, paper format and orientation.
    // The degree lenght is calculated in the center of the rectangle
    function _get_scale_from_bounds(bounds, format, orientation){
      var lat = bounds.getCenter().lat;
      var avg_west = L.latLng(lat, bounds.getNorthWest().lng);
      var avg_east = L.latLng(lat, bounds.getNorthEast().lng);
      var deg_length = _deg_length(avg_west, avg_east);
      var formats = getFormats(A4_width_mm, A4_height_mm);
      var width__km = formats[format][orientation].width / 1000000;
      return Math.round(deg_length / width__km);
    };

    // Returns the A series paper ratio for portrait or landscape
    function _computeRatio(orientation){
      return orientation === 'portrait' ? Math.sqrt(2) : 1 / Math.sqrt(2); 
    };

    function computeTargetLat(startLatLng, endLatLng, orientation){
      var west = startLatLng.lng;
      var north = startLatLng.lat;
      var east = endLatLng.lng;
      var ratio = _computeRatio(orientation);
      
      // Calculate the south coordinate by keeping into accout the
      // degree lenght change on latitude. This because the feature has to respect
      // the A series paper size ratio.
      return north - ratio * (east - west) * 
      Math.cos(north * L.LatLng.DEG_TO_RAD);
    };

    this.$get = function(){
      return {
        getLatForBounds: function(startLatLng, endLatLng, orientation){
          return computeTargetLat(startLatLng, endLatLng, orientation || 'landscape');
        },
        formats: function(){return getFormats(A4_width_mm, A4_height_mm)},
        getScaleFromBounds: _get_scale_from_bounds
      }
    }
  });
})();