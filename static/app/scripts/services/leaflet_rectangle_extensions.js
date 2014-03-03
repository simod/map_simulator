'use strict';

(function(){
  goog.provide('leaflet_rectangle_extensions');

  var module = angular.module('leaflet_rectangle_extensions', []);

  module.factory('LeafletRectangleExtensions', function(){
    return {
      extend: function(){
        L.Rectangle.prototype.recalculate_bounds = function(){
          var scale_factor = this.scale / this.prev_scale;
          var current_bounds = this.getBounds();
          var south = current_bounds._southWest.lat;
          var west = current_bounds._southWest.lng;
          var north = current_bounds._northEast.lat;
          var east = current_bounds._northEast.lng;

          var lat_increase = (north - south) * (scale_factor - 1) / 2;
          var lng_increase = (east - west) * (scale_factor - 1)  / 2;

          this.prev_scale = this.scale;
          
          this.setBounds(L.latLngBounds(
            new L.LatLng(
              south - lat_increase,
              west - lng_increase
            ),
            new L.LatLng(
              north + lat_increase,
              east + lng_increase
            )
          ));
        }
      }
    }
  });
})();