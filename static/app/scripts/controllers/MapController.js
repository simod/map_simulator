'use strict';
(function(){

  goog.provide('map_controller');

  goog.require('leaflet_draw_overrides');

  var module = angular.module('map_controller', [
  'leaflet-directive',
  'leaflet_draw_overrides'
  ]);

  module.controller('MapController', function(
    $scope, leafletData, LeafletDrawOverrides
    ){

    $scope.rectangles = [];

    angular.extend($scope, {
      layers: {
        baselayers: {
          ithaca: {
            name: 'ithaca-silver',
            type: 'wms',
            url: 'http://playground.ithacaweb.org/geoserver/gwc/service/wms',
            layerOptions: {
              layers: 'gmes:erds',
              format: 'image/png'
            }
          }
        }
      },
      center: {
        lat: 5.6,
        lng: 3.9,
        zoom: 2
      }
    });

    // Override Leaflet Draw
    LeafletDrawOverrides.overrideEditRectangle();

    var map = leafletData.getMap();

    map.then(function(map){
      var rectangles = new L.FeatureGroup().addTo(map);

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

      var rect_id = 0;

      // For some reason the edit buttons are toggled every feature addition
      // we force them to be always active either after a feature add or remove.
      map.on('draw:created', function(e){
        e.layer.addTo(rectangles);  
        e.layer.id = rect_id;
        rect_id ++;
        $scope.rectangles.push(e.layer);
        $('.leaflet-draw-toolbar').find('a').removeClass('leaflet-disabled');
      });
     
      map.on('draw:deleted', function(e){
        for(var i=0; i < $scope.rectangles.length; i++){
          for(var j=0; j<e.layers.getLayers().length; j++){
            if($scope.rectangles[i].id === e.layers.getLayers()[j].id){
              $scope.rectangles.splice(i, 1);
            }
          }
        }
        $('.leaflet-draw-toolbar').find('a').removeClass('leaflet-disabled');
      });

    });
  });
})();