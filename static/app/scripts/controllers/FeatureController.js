'use strict';
(function(){
  goog.provide('feature_controller');

  goog.require('format_ratio_provider');

  var module = angular.module('feature_controller', ['format_ratio_provider']);
  module.controller('FeatureController', function($scope, FormatRatioProvider){
    // set the initial parameters
  var formats = FormatRatioProvider.formats;
    $scope.feature.format = 'A0'
    $scope.feature.orientation = 'landscape';    

    $scope.feature.prev_scale = $scope.feature.scale = getScale();

    // Set the scale adjust the rectangle
    $scope.setScale = function(){
      $scope.feature.recalculate_bounds();
    };

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
      var width__km = formats[$scope.feature.format][$scope.feature.orientation].width / 1000000;
      return deg_length / width__km;
    };

    function getScale(){  
      return _get_scale_from_bounds(
        $scope.feature.getBounds(), $scope.feature.format, $scope.feature.orientation);
    }
    $scope.feature.getScale = getScale;

  });
})();