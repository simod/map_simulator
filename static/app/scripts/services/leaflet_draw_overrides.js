'use strict';
(function(){
  goog.provide('leaflet_draw_overrides');

  goog.require('format_ratio_provider');

  var module = angular.module('leaflet_draw_overrides', ['format_ratio_provider']);

  module.factory('LeafletDrawOverrides', function(FormatRatioProvider){

    return {
      overrideEditRectangle: function(){
        // Override the resize method of the editing tool to respect the format ratio
        L.Edit.Rectangle.prototype._resize = function (latlng) {
          var bounds;

          // Calculate the target lat based on fixed proportions
          latlng.lat = FormatRatioProvider.getLatForBounds(
            this._oppositeCorner, latlng, this._shape.orientation);

          this._shape.setBounds(L.latLngBounds(latlng, this._oppositeCorner));

          // Reposition the move marker
          bounds = this._shape.getBounds();
          this._moveMarker.setLatLng(bounds.getCenter());
          this._shape.scale = this._shape.prev_scale = this._shape.getScale();
        };

        // Override the create marker method to just show the bottom right one
        L.Edit.Rectangle.prototype._createResizeMarker= function () {
          var corners = this._getCorners();
          this._resizeMarkers = [];

            this._resizeMarkers.push(this._createMarker(corners[2], this.options.resizeIcon));
            // Monkey in the corner index as we will need to know this for dragging
            this._resizeMarkers[0]._cornerIndex = 2;
        };

        // Override the reposizion markers, to just use the botton right
        L.Edit.Rectangle.prototype._repositionCornerMarkers = function () {
          var corners = this._getCorners();

          this._resizeMarkers[0].setLatLng(corners[2]);
        };

        // Override the drawShape method of the draw tool to respect the format ratio
        L.Draw.Rectangle.prototype._drawShape = function (latlng) {
          // Calculate the target lat based on fixed proportions
          latlng.lat = FormatRatioProvider.getLatForBounds(
            this._startLatLng, latlng);
          
          if (!this._shape) {
            this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
            this._map.addLayer(this._shape);
          } else {
            this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
          }
        };

        // Override the edit move to preserve the shape based on the lat lon
        L.Edit.Rectangle.prototype._move = function (newCenter) {
          var latlngs = this._shape.getLatLngs(),
            bounds = this._shape.getBounds(),
            center = bounds.getCenter(),
            offset, newLatLngs = [];

          // Offset the latlngs to the new center
          for (var i = 0, l = latlngs.length; i < l; i++) {
            offset = [latlngs[i].lat - center.lat, latlngs[i].lng - center.lng];
            newLatLngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
          }
          this._shape.setLatLngs(newLatLngs);
          
          //calculate the new lat and adjust the shape again
          var northWest = this._shape.getBounds().getNorthWest();
          var southEast = this._shape.getBounds().getSouthEast();
          southEast.lat = FormatRatioProvider.getLatForBounds(
            northWest, southEast, this._shape.orientation);

          this._shape.setBounds(new L.LatLngBounds(northWest, southEast));

          // Reposition the resize markers
          this._repositionCornerMarkers();
        };
      }
    }
  });
})();