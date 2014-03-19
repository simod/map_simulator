'use strict';
(function(){
  goog.provide('format_ratio_provider');

  goog.require('measures_provider');

  var module = angular.module('format_ratio_provider', ['measures_provider']);

  module.provider('FormatRatioProvider', function(){

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

    // Returns the A series paper ratio for portrait or landscape
    function _computeRatio(orientation){
      return orientation === 'portrait' ? Math.sqrt(2) : 1 / Math.sqrt(2); 
    };

    function _computeTargetLat(startLatLng, endLatLng, orientation){
      var west = startLatLng.lng;
      var north = startLatLng.lat;
      var east = endLatLng.lng;
      var south = endLatLng.lat;
      var ratio = _computeRatio(orientation);
      var center = new L.LatLngBounds(startLatLng, endLatLng).getCenter();
      // Calculate the south coordinate by keeping into accout the
      // degree lenght change on latitude. This because the feature has to respect
      // the A series paper size ratio.
      return north - ratio * (east - west) * 
      Math.cos(center.lat * L.LatLng.DEG_TO_RAD);
    };

    this.$get = function(MeasuresProvider){
      var measures = MeasuresProvider.measures;
      return {
        getLatForBounds: function(startLatLng, endLatLng, orientation){
          return _computeTargetLat(startLatLng, endLatLng, orientation || 'landscape');
        },
        // Calculate the scale for bounds, paper format and orientation.
        // The degree lenght is calculated in the center of the rectangle
        getScaleFromBounds: function (bounds, format, orientation){ 
          var lat = bounds.getCenter().lat;
          var avg_west = L.latLng(lat, bounds.getNorthWest().lng);
          var avg_east = L.latLng(lat, bounds.getNorthEast().lng);
          var deg_length = _deg_length(avg_west, avg_east);
          var width__km = measures[format][orientation].width / 1000000;
          return Math.round(deg_length / width__km);
        }
      }
    }
  });
})();