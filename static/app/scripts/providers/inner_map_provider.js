'use strict';
(function(){
  goog.provide('inner_map_provider');

  goog.require('measures_provider');

  var module = angular.module('inner_map_provider', ['measures_provider']);
  module.provider('InnerMapProvider', function(){

    this.$get = function(MeasuresProvider){
      return {
        innerMap: function(bounds, format, orientation){
          var north = bounds.getNorth();
          var south = bounds.getSouth();
          var west = bounds.getWest();
          var east = bounds.getEast();
          // Get the format to work width
          var format_measures = MeasuresProvider.measures[format][orientation];

          var lat_offset = (north - south) * format_measures.inner_box_offsets.top / format_measures.height;
          var lng_offset = (east - west) * format_measures.inner_box_offsets.left / format_measures.width;
          
          var inner_heigth = (north - south) * format_measures.inner_box_ratios.height;
          var inner_width = (east - west) * format_measures.inner_box_ratios.width;
          
          var start_point = new L.LatLng(
            north - lat_offset,
            west + lng_offset
          );
          var end_point = new L.LatLng(
            start_point.lat - inner_heigth,
            start_point.lng + inner_width
          );

          return new L.Rectangle(new L.LatLngBounds(start_point, end_point));
        }
      }
    };
  });
})();