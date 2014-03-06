'use strict';
(function(){
  goog.provide('kml_service');

  var module = angular.module('kml_service', []);
  module.factory('KmlService', function($http, $window){
    return {
      serializeJson: function(layers){
        var json = {
          type: "FeatureCollection",
          features: []
        }
        for(var i in layers){
          var feature = layers[i].toGeoJSON();
          feature.properties['title'] = layers[i].title;
          feature.properties['format'] = layers[i].format;
          feature.properties['orientation'] = layers[i].orientation;
          feature.properties['scale'] = layers[i].scale;
          json.features.push(feature);
        }
        return json;
      },
      requestKml: function(json){
        $http.post('maps', {features: json}).success(function(){
          location.href='static/data/maps.kml';
        });
      }
    }
  });
})();