'use strict';
(function(){

  goog.provide('map_controller');

  goog.require('fixed_rectangle_provider');

  var module = angular.module('map_controller', [
  'leaflet-directive',
  'fixed_rectangle_provider'
  ]);

  module.controller('MapController', function($scope, leafletData, FixedRectangleProvider){
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

    var getRectangle = function(center, zoom){
      return [
        [center.lat, center.lng],
        [ center.lat + 30 / zoom, center.lng + 50 / zoom]
      ]
    }

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

      L.Rectangle.addInitHook(function () {
        if (FixedRectangleProvider.EditRectangle) {
          this.editing = new FixedRectangleProvider.EditRectangle(this);
        }
      });

      $scope.addRectangle = function(){

        var zoom = map.getZoom();
        var center = map.getCenter();

        var rectangle = L.rectangle(getRectangle(center, zoom),
          {color: "#ff7800", weight: 1}).addTo(rectangles);

        rectangle.on('click', function(e){ 
          if(e.target.options.editable){
            e.target.options.editable = false;
            e.target.editing.disable();
          }else{
            e.target.options.editable = true;
            e.target.editing.enable();
          }
        });

        $('.leaflet-draw-edit-edit').removeClass('leaflet-disabled');
        $('.leaflet-draw-edit-remove').removeClass('leaflet-disabled');
      }
    });
  });
})();