'use strict';
(function(){
  goog.provide('feature_controller');

  goog.require('measures_provider');

  var module = angular.module('feature_controller', ['measures_provider']);
  module.controller('FeatureController', function($scope, MeasuresProvider){
    
    //shortcuts
    var feature = $scope.feature;
    // set the initial parameters
    $scope.formats = Object.keys(MeasuresProvider.measures).reverse();
    feature.format = $scope.formats[0];
    feature.orientation = 'landscape';
    feature.title = 'Title';

    $scope.$watch('feature.format', function(){
      feature.prev_scale = feature.scale = feature.getScale();
    });

    $scope.$watch('feature.title', function(){
      feature.bindPopup(feature.title)._openPopup({latlng: feature.getBounds().getCenter()});
    });

    //Draw inner box at creation
    feature.updateInnerBox();
  });
})();