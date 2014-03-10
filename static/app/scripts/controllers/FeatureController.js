'use strict';
(function(){
  goog.provide('feature_controller');

  goog.require('format_ratio_provider');
  goog.require('inner_map_provider')

  var module = angular.module('feature_controller', ['format_ratio_provider', 'inner_map_provider']);
  module.controller('FeatureController', function($scope, FormatRatioProvider, InnerMapProvider){
    
    //shortcuts
    var feature = $scope.feature;
    var map = feature._map;
    // set the initial parameters
    $scope.formats = Object.keys(FormatRatioProvider.formats()).reverse();
    feature.format = $scope.formats[0];
    feature.orientation = 'landscape';
    feature.title = 'Title';
    $scope.$watch('feature.format', function(){
      feature.prev_scale = feature.scale = feature.getScale();
    });

    $scope.$watch('feature.title', function(){
      feature.bindPopup(feature.title)._openPopup({latlng: feature.getBounds().getCenter()});
    });



    //switches the orientation between landscape and portrait
    $scope.switchOrientation =  function(){
      var bounds = feature.getBounds();
      var northWest = bounds.getNorthWest();
      var southEast = bounds.getSouthEast();
      // Calculate the lng increase which is the current lat distance
      var lng_increase = (northWest.lat - southEast.lat) / Math.cos(bounds.getCenter().lat * L.LatLng.DEG_TO_RAD);
      
      southEast.lng = northWest.lng + lng_increase;
      // Calculate the ending lat taking into account the deg length changes
      southEast.lat = FormatRatioProvider.getLatForBounds(
        northWest, southEast, feature.orientation);
      feature.setBounds(L.latLngBounds(northWest, southEast));
      feature.toggleInnerBox();
    };

    //Function to retireve the scale based on the current bbox.
    $scope.feature.getScale = function(){  
      return FormatRatioProvider.getScaleFromBounds(
        feature.getBounds(), feature.format, feature.orientation);
    };

    /** 
    * Inner map box management. Called on every move, resize, scale.
    **/

    //Private, used to create the internal map box.
    function _makeInnerBox(){
     feature.innerBox = InnerMapProvider.innerMap(
      feature.getBounds(), 
      feature.format, 
      feature.orientation);
     map.addLayer(feature.innerBox);
    };

    feature.innerBox;
    feature.toggleInnerBox = function(){
      if(typeof feature.innerBox != 'undefined' && map.hasLayer(feature.innerBox)){
        map.removeLayer(feature.innerBox);
        _makeInnerBox();
      }else{
        _makeInnerBox();
      }
      feature.innerBox.bringToBack();
    };
    //Draw inner box at creation
    feature.toggleInnerBox();
  });
})();