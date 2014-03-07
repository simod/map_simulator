'use strict';
(function(){
  goog.provide('feature_controller');

  goog.require('format_ratio_provider');
  goog.require('inner_map_provider')

  var module = angular.module('feature_controller', ['format_ratio_provider', 'inner_map_provider']);
  module.controller('FeatureController', function($scope, FormatRatioProvider, InnerMapProvider){
    // set the initial parameters
    $scope.formats = Object.keys(FormatRatioProvider.formats()).reverse();
    $scope.feature.format = $scope.formats[0];
    $scope.feature.orientation = 'landscape';
    $scope.feature.title = 'Title';
    $scope.$watch('feature.format', function(){
      $scope.feature.prev_scale = $scope.feature.scale = $scope.feature.getScale();
    });

    $scope.$watch('feature.title', function(){
      $scope.feature.bindPopup($scope.feature.title)._openPopup({latlng: $scope.feature.getBounds().getCenter()});
    });

    //switches the orientation between landscape and portrait
    $scope.switchOrientation =  function(){
      var bounds = $scope.feature.getBounds();
      var northWest = bounds.getNorthWest();
      var southEast = bounds.getSouthEast();
      // Calculate the lng increase which is the current lat distance
      var lng_increase = (northWest.lat - southEast.lat) / Math.cos(bounds.getCenter().lat * L.LatLng.DEG_TO_RAD);
      
      southEast.lng = northWest.lng + lng_increase;
      // Calculate the ending lat taking into account the deg lenght changes
      southEast.lat = FormatRatioProvider.getLatForBounds(
        northWest, southEast, $scope.feature.orientation);
      $scope.feature.setBounds(L.latLngBounds(northWest, southEast));
    };

    $scope.feature.getScale = function(){  
      return FormatRatioProvider.getScaleFromBounds(
        $scope.feature.getBounds(), $scope.feature.format, $scope.feature.orientation);
    };

    var innerBox;
    $scope.toggleInnerBox = function(){
      var map = $scope.feature._map;
      if(typeof innerBox != 'undefined' && map.hasLayer(innerBox)){
        map.removeLayer(innerBox);
      }else{
        innerBox = InnerMapProvider.innerMap(
          $scope.feature.getBounds(), 
          $scope.feature.format, 
          $scope.feature.orientation
        );
        map.addLayer(innerBox);
      }

    }
  });
})();