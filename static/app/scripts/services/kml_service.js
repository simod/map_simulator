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
          var feature = layers[i].innerBox.toGeoJSON();
          feature.properties['title'] = layers[i].title;
          feature.properties['format'] = layers[i].format;
          feature.properties['orientation'] = layers[i].orientation;
          feature.properties['scale'] = layers[i].scale;
          json.features.push(feature);
        }
        return json;
      },
      requestKml: function(json){
        $http.post('maps/to-kml', {features: json}).success(function(){
          location.href='static/kml/map.kml';
        });
      },
      sendKml: function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
      }
    }
  });
})();