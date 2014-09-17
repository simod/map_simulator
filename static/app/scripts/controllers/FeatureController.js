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
    feature.title = 'Map';

    $scope.$watch('feature.format', function(){
      feature.prev_scale = feature.scale = feature.getScale();
    });

    $scope.$watch('feature.title', function(){
      feature.bindPopup(feature.title);
    });

    //Draw inner box at creation
    feature.updateInnerBox();

    feature.selectFeature = function(){
      this._map.deselectAllFeatures(this);
      this.setStyle({
          color: '#FF9933'
      });
      $('#feature-'+this._leaflet_id).addClass('feature-selected');
      if (!this._popup._isOpen){
        this.openPopup();
        var top_scroll = $scope.rectangles.indexOf(this) * 150;
        $('.features').animate({
          scrollTop: top_scroll
        });
      }    
    };

    feature.deselectFeature = function(){
      this.setStyle({
          color: '#f06eaa'
      });
      $('#feature-'+this._leaflet_id).removeClass('feature-selected');
      this.closePopup();
    };
    
    feature.zoomToFeature = function(){
      this._map.fitBounds(this.getBounds(), {padding: [50,50]});
    };

    feature.on({
      click: feature.selectFeature
    });
  });
})();