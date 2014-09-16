'use strict';
(function(){

  goog.provide('map_controller');

  goog.require('leaflet_draw_overrides');
  goog.require('leaflet_rectangle_extensions');
  goog.require('kml_service');
  

  var module = angular.module('map_controller', [
    'leaflet-directive',
    'leaflet_draw_overrides',
    'leaflet_rectangle_extensions',
    'kml_service',
  ]);

  module.controller('MapController', function(
    $scope, leafletData, LeafletDrawOverrides, 
    LeafletRectangleExtensions, KmlService
    ){

    angular.extend($scope, {
      center: {
        lat: 5.6,
        lng: 3.9,
        zoom: 2
      }
    });

    // Override Leaflet Draw
    LeafletDrawOverrides.overrideEditRectangle();

    // Extend Leaflet Rectangle
    LeafletRectangleExtensions.extend();

    var map = leafletData.getMap();

    map.then(function(map){
      var rectangles = new L.FeatureGroup().addTo(map);
      //$scope.rectangles = rectangles._layers;
      $scope.rectangles = [];
      var drawControl = new L.Control.Draw({
        draw: {
          marker: null,
          polygon: null,
          polyline: null,
          circle: null
        },
        edit: {
          featureGroup: rectangles
        }
      }).addTo(map);

      // For some reason the edit buttons are toggled every feature addition
      // we force them to be always active either after a feature add or remove.
      map.on('draw:created', function(e){
        $scope.rectangles.push(e.layer);
        e.layer.addTo(rectangles);
        $('.leaflet-draw-toolbar').find('a').removeClass('leaflet-disabled');
        e.layer.selectFeature();
      });
     
      map.on('draw:deleted', function(e){
        $('.leaflet-draw-toolbar').find('a').removeClass('leaflet-disabled');
        for(var i in e.layers._layers){
          map.removeLayer(e.layers._layers[i].innerBox);
        }
      });

      // reset the rectangle styles is the map is clicked (deselect)

      map.deselectAllFeatures = function(current_feature){
        for(var i in $scope.rectangles){
          if ($scope.rectangles[i]._leaflet_id != current_feature._leaflet_id){
            $scope.rectangles[i].deselectFeature();
          }
        }
      }
      map.on('click', map.deselectAllFeatures);

      $scope.exportKML = function(){
        var json = KmlService.serializeJson($scope.rectangles);
        KmlService.requestKml(json);
      }

      $scope.rectanglesLength = function(){
        return $scope.rectangles.length;
      }
    });
  });
})();