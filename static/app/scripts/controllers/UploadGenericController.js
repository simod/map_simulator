'use strict';
(function(){

  goog.provide('upload_generic_controller');

  var module = angular.module('upload_generic_controller', ['leaflet-directive']);

  module.controller('UploadGenericController', function($scope, leafletData){
    var map = leafletData.getMap();

    var reader = new FileReader();
    reader.onloadend = function(evt){
      if (evt.target.readyState == FileReader.DONE) {
        map.then(function(map){
          var geojson = toGeoJSON['kml']((new DOMParser()).parseFromString(evt.target.result, 'text/xml'))
          var layer =  L.geoJson(geojson, {
            style:{
              "color": "#336633",
              "weight": 3,
              "opacity": 0.65
            },
            pointToLayer: function (feature, latlng) {
              return new L.CircleMarker(latlng, {
                    radius: 0,
                    opacity: 0,
                    stroke: false
                });
            },
            onEachFeature: function(feature, layer){
              var popupContent = '';
              // for (var prop in feature.properties){
              //   popupContent += prop + ': ' + feature.properties[prop] + '</br>'
              // }
              layer.bindPopup(feature.properties['description']);
            }
          });
        
          layer.addTo(map);
          map.fitBounds(layer.getBounds());
          $('#upload_generic_kml').modal('toggle');
        });
      }
    }

    $scope.loadKML = function(){
      var file = $scope.kmlFile;
      file = file.slice(0, file.size);
      
      reader.readAsBinaryString(file);
    };
  });
})();