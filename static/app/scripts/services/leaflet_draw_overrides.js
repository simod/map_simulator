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
          latlng.lat = FormatRatioProvider.A0(this._oppositeCorner, latlng);

          this._shape.setBounds(L.latLngBounds(latlng, this._oppositeCorner));

          // Reposition the move marker
          bounds = this._shape.getBounds();
          this._moveMarker.setLatLng(bounds.getCenter());
        };

        L.Edit.Rectangle.prototype._createResizeMarker= function () {
          var corners = this._getCorners();
          this._resizeMarkers = [];

            this._resizeMarkers.push(this._createMarker(corners[2], this.options.resizeIcon));
            // Monkey in the corner index as we will need to know this for dragging
            this._resizeMarkers[0]._cornerIndex = 2;
        };

        L.Edit.Rectangle.prototype._repositionCornerMarkers= function () {
          var corners = this._getCorners();

          this._resizeMarkers[0].setLatLng(corners[2]);
        };

        // Override the drawShape method of the draw tool to respect the format ratio
        L.Draw.Rectangle.prototype._drawShape = function (latlng) {
          // Calculate the target lat based on fixed proportions
          latlng.lat = FormatRatioProvider.A0(this._startLatLng, latlng);
          
          if (!this._shape) {
            this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
            this._map.addLayer(this._shape);
          } else {
            this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
          }
        }
      }
    }
  });
})();