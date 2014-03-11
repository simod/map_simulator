'use strict';

(function(){
  goog.provide('leaflet_rectangle_extensions');

  goog.require('inner_map_provider');
  goog.require('format_ratio_provider');

  var module = angular.module('leaflet_rectangle_extensions', [
    'inner_map_provider', 'format_ratio_provider']);

  module.factory('LeafletRectangleExtensions', function(InnerMapProvider, FormatRatioProvider){
    return {
      extend: function(){

        // Used to recalculate the bounds when the scale is changed
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
          // Redraw the inner map box
          this.updateInnerBox();
        };

        /** 
        * Inner map box management. Called on every move, resize, scale.
        **/

        // Define the feature inner box
        L.Rectangle.prototype.innerBox = null;

        // Updates the inner box by destroying and creating it back
        L.Rectangle.prototype.updateInnerBox = function(){
          if(typeof this.innerBox != 'undefined' && this._map.hasLayer(this.innerBox)){
            this._map.removeLayer(this.innerBox);
            this._makeInnerBox();
          }else{
            this._makeInnerBox();
          }
          this.innerBox.bringToBack();
        };

        //Private, used to create the internal map box.
        L.Rectangle.prototype._makeInnerBox = function(){
         this.innerBox = InnerMapProvider.innerMap(
          this.getBounds(), 
          this.format, 
          this.orientation);
         this._map.addLayer(this.innerBox);
        };

        //Function to retireve the scale based on the current bbox.
        L.Rectangle.prototype.getScale = function(){  
          return FormatRatioProvider.getScaleFromBounds(
            this.getBounds(), this.format, this.orientation);
        };

        //switches the orientation between landscape and portrait
        L.Rectangle.prototype.switchOrientation =  function(){
          var bounds = this.getBounds();
          var northWest = bounds.getNorthWest();
          var southEast = bounds.getSouthEast();
          // Calculate the lng increase which is the current lat distance
          var lng_increase = (northWest.lat - southEast.lat) / Math.cos(bounds.getCenter().lat * L.LatLng.DEG_TO_RAD);
          
          southEast.lng = northWest.lng + lng_increase;
          // Calculate the ending lat taking into account the deg length changes
          southEast.lat = FormatRatioProvider.getLatForBounds(
            northWest, southEast, this.orientation);
          this.setBounds(L.latLngBounds(northWest, southEast));
          this.updateInnerBox();
        };
      }
    }
  });
})();