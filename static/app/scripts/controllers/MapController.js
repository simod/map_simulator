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
        lat: 20,
        lng: 3.9,
        zoom: 3
      },
      layers: {
        baselayers: {
          osm: {
              name: 'MapQuest',
              url: 'http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
              type: 'xyz'
          }
        }
      }
    });

    // Override Leaflet Draw
    LeafletDrawOverrides.overrideEditRectangle();

    // Extend Leaflet Rectangle
    LeafletRectangleExtensions.extend();

    var map = leafletData.getMap();

    map.then(function(map){
      //add fullscreen control
      new L.control.fullscreen().addTo(map);

      // Hook the enter/exit fullscreen behaviors
      map.on('enterFullscreen', function () {
        $('#sidebar').addClass('fullscreen');
        map.zoomIn(1);
      });
      map.on('exitFullscreen', function () {
        $('#sidebar').removeClass('fullscreen');
        map.zoomOut(1);
      });

      var rectangles = new L.FeatureGroup().addTo(map);

      // Initialize an empty array of rectangles, 
      // it has to be an array for 0rdering issues
      $scope.rectangles = [];

      //Add the draw control
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

      // Hooks to add created/delete features to the map
      map.on('draw:created', function(e){
        // Push the drawn feature to the angular scope an add it to the map
        $scope.rectangles.push(e.layer);
        e.layer.addTo(rectangles);
        // For some reason the edit buttons are toggled every feature addition
        // we force them to be always active either after a feature add or remove.
        $('.leaflet-draw-toolbar').find('a').removeClass('leaflet-disabled');
        // Make sure the drawn feature is also selected, so highlighted
        e.layer.selectFeature();
      });

      
      map.on('draw:deleted', function(e){
        $('.leaflet-draw-toolbar').find('a').removeClass('leaflet-disabled');
        // Splice the deleted feature from the angular scope and remove the inner box
        // It has to be aloop because many features can be deleted in a row
        for(var i in e.layers._layers){
          $scope.rectangles.splice($scope.rectangles.indexOf(e.layers._layers[i]),1);
          // remove the deleted feature from the map
          map.removeLayer(e.layers._layers[i].innerBox);
        }
      });

      // reset the rectangle styles is the map is clicked (deselect)
      // don't do it if the clicked feature is already selected
      map.deselectAllFeatures = function(current_feature){
        for(var i in $scope.rectangles){
          if ($scope.rectangles[i]._leaflet_id != current_feature._leaflet_id){
            $scope.rectangles[i].deselectFeature();
          }
        }
      }
      // use mousedown instead of click to avoid deselection afterd drawing a new one
      map.on('mousedown', map.deselectAllFeatures);

      // export in kml function
      $scope.exportKML = function(){
        var json = KmlService.serializeJson($scope.rectangles);
        KmlService.requestKml(json);
      }

    });
  });
})();