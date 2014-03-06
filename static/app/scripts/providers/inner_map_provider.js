'use strict';
(function(){
  goog.provide('inner_map_provider');

  goog.require('format_ratio_provider');

  var module = angular.module('inner_map_provider', ['format_ratio_provider']);
  module.provider('InnerMapProvider', function(){

    var box_ratios = {
      landscape: {
        width: 0.81,
        height: 0.94
      },
      portrait: {
        width: 0.94,
        height: 0.72
      }
    };

    var offsets = {
      landscape: {
        top: 18.1,
        left: 18.1
      },
      portrait: {
        top: 14.6,
        left: 18.1
      }
    };

    this.$get = function(FormatRatioProvider){
      return {
        innerMap: function(bounds, format, orientation){
          var north = bounds.getNorth();
          var south = bounds.getSouth();
          var west = bounds.getWest();
          var east = bounds.getEast();

          var format_measures = FormatRatioProvider.formats()[format][orientation];

          var lat_offset = (north - south) * offsets[orientation].top / format_measures.height;
          var lng_offset = (east - west) * offsets[orientation].left / format_measures.width;
          
          var inner_heigth = (north - south) * box_ratios[orientation].height;
          var inner_width = (east - west) * box_ratios[orientation].width;
          
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