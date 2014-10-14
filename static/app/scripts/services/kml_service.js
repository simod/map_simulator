'use strict';
(function(){
  goog.provide('kml_service');

  var module = angular.module('kml_service', []);
  module.factory('KmlService', function($rootScope, $http, $window){
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
          feature.properties['reference'] = layers[i].reference;
          feature.properties['grading'] = layers[i].grading;
          feature.properties['delineation'] = layers[i].delineation;
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
        .success(function(data){
          $rootScope.$broadcast('kml_loaded', data.features);
          $('#upload_kml').modal('hide');
        })
        .error(function(data){
          alert(data);
        });
      }
    }
  });
})();