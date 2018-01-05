'use strict';
(function(){

  goog.provide('map_controller');

  goog.require('leaflet_draw_overrides');
  goog.require('leaflet_rectangle_extensions');
  goog.require('kml_service');
  goog.require('inner_map_provider');

  var module = angular.module('map_controller', [
    'leaflet-directive',
    'leaflet_draw_overrides',
    'leaflet_rectangle_extensions',
    'kml_service',
  ]);

  module.controller('MapController', function(
    $scope, leafletData, LeafletDrawOverrides,
    LeafletRectangleExtensions, KmlService, InnerMapProvider
    ){

    var today = new Date();
    var week = new Date();
    week.setDate(week.getDate() - 7);

    angular.extend($scope, {
      center: {
        lat: 50,
        lng: 3.9,
        zoom: 3
      },
      layers: {
        baselayers: {
          osm: {
            name: 'OpenStreetMap',
            url: 'http://europa.eu/webtools/maps/tiles/osm-ec/{z}/{x}/{y}.png',
            type: 'xyz',
            layerParams: {
              attribution: '<a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> Contributors | <a href="javascript:alert(\'The designations employed and the presentation of material on this map do not imply the expression of any opinion whatsoever on the part of the European Union concerning the legal status of any country, territory, city or area or of its authorities, or concerning the delimitation of its frontiers or boundaries. \n\nKosovo*: This designation is without prejudice to positions on status, and is in line with UNSCR 1244/1999 and the ICJ Opinion on the Kosovo declaration of independence. \n\nPalestine*: This designation shall not be construed as recognition of a State of Palestine and is without prejudice to the individual positions of the Member States on this issue.\');">Disclaimer</a>'
            }
          },
          googleTerrain: {
            name: 'Google Terrain',
            layerType: 'TERRAIN',
            type: 'google'
          },
          googleHybrid: {
            name: 'Google Hybrid',
            layerType: 'HYBRID',
            type: 'google'
          },
          googleRoadmap: {
            name: 'Google Streets',
            layerType: 'ROADMAP',
            type: 'google'
          }
        },
        overlays: {
          effisModis: {
            name: 'EFFIS active fires 7 days Modis',
            type: 'wms',
            url: 'http://ies-ows.jrc.ec.europa.eu/effis',
            layerParams: {
              layers: 'modis.hs',
              format: 'image/png',
              transparent: true,
              singletile: false,
              time: week.toISOString().split('T')[0] + '/' + today.toISOString().split('T')[0],
              attribution: '<a href="http://effis.jrc.ec.europa.eu/static/effis_current_situation/public/index.html" target="_blank">EFFIS layers from current situation viewer</a>'
            }
          },
          effisViirs: {
            name: 'EFFIS active fires 7 days Viirs',
            type: 'wms',
            url: 'http://ies-ows.jrc.ec.europa.eu/effis',
            layerParams: {
              layers: 'viirs.hs',
              format: 'image/png',
              transparent: true,
              singletile: false,
              time: week.toISOString().split('T')[0] + '/' + today.toISOString().split('T')[0],
              attribution: '<a href="http://effis.jrc.ec.europa.eu/static/effis_current_situation/public/index.html" target="_blank">EFFIS layers from current situation viewer</a>'
            }
          },
          effisBaModis: {
            name: 'EFFIS burnt areas Modis',
            type: 'wms',
            url: 'http://ies-ows.jrc.ec.europa.eu/effis',
            layerParams: {
              layers: 'modis.ba',
              format: 'image/png',
              transparent: true,
              singletile: false,
              time: today.toISOString().split('T')[0] + '/' + today.toISOString().split('T')[0],
              attribution: '<a href="http://effis.jrc.ec.europa.eu/static/effis_current_situation/public/index.html" target="_blank">EFFIS layers from current situation viewer</a>'
            }
          },
          effisBaViirs: {
            name: 'EFFIS burnt areas Viirs',
            type: 'wms',
            url: 'http://ies-ows.jrc.ec.europa.eu/effis',
            layerParams: {
              layers: 'viirs.ba',
              format: 'image/png',
              transparent: true,
              singletile: false,
              time: today.toISOString().split('T')[0] + '/' + today.toISOString().split('T')[0],
              attribution: '<a href="http://effis.jrc.ec.europa.eu/static/effis_current_situation/public/index.html" target="_blank">EFFIS layers from current situation viewer</a>'
            }
          }
        }
      }
    });

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map){
      var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML =
      '<div class="legend-item"><strong>Active Fires MODIS</strong> <br/>' +
      '<img src="http://ies-ows.jrc.ec.europa.eu/effis?format=image/png&request=getlegendgraphic&service=WMS&singletile=false&transparent=true&version=1.1.1&layer=modis.hs"/></div>' +
      '<div class="legend-item"><strong>Active Fires VIIRS</strong> <br/>' +
      '<img src="http://ies-ows.jrc.ec.europa.eu/effis?format=image/png&request=getlegendgraphic&service=WMS&singletile=false&transparent=true&version=1.1.1&layer=viirs.hs"/></div>' +
      '<div class="legend-item"><strong>Burnt Areas MODIS</strong> <br/>' +
      '<img src="http://ies-ows.jrc.ec.europa.eu/effis?format=image/png&request=getlegendgraphic&service=WMS&singletile=false&transparent=true&version=1.1.1&layer=modis.ba"/></div>' +
      '<div class="legend-item"><strong>Burnt Areas VIIRS</strong> <br/>' +
      '<img src="http://ies-ows.jrc.ec.europa.eu/effis?format=image/png&request=getlegendgraphic&service=WMS&singletile=false&transparent=true&version=1.1.1&layer=viirs.ba"/></div>';

      return div;
    };

    var legendButton = L.control({position: 'topright'});
    legendButton.onAdd = function(map){
      var container = L.DomUtil.create('button', 'easy-button-button leaflet-bar leaflet-interactive');
      var container_icon = L.DomUtil.create('img', '', container);
      container_icon.src = '/static/images/list_icon.png';
      container_icon.style.width = '25px';
      container_icon.style.height = '25px';
      container_icon.style.paddingRight = '3px';

      container.style.backgroundColor = 'white';
      container.style.width = '35px';
      container.style.height = '35px';

      L.DomEvent.on(container, 'mouseover', function(ev){
        legend.addTo(map);
        L.DomEvent.stopPropagation(ev);
      });
      L.DomEvent.on(container, 'mouseout', function(ev){
        legend.removeFrom(map);
        L.DomEvent.stopPropagation(ev);
      });

      return container;
    }

    // Override Leaflet Draw
    LeafletDrawOverrides.overrideEditRectangle();

    // Extend Leaflet Rectangle
    LeafletRectangleExtensions.extend();

    var map = leafletData.getMap();

    map.then(function(map){

      legendButton.addTo(map);

      map.attributionControl.setPrefix('');

      //add fullscreen control
      if (!window.hasOwnProperty('ActiveXObject')){
        new L.control.fullscreen().addTo(map);
      }

      // Hook the enter/exit fullscreen behaviors
      map.on('enterFullscreen', function () {
        $('#sidebar').addClass('fullscreen');
        map.zoomIn(1);
        map.panBy(L.point(2, 2));
      });
      map.on('exitFullscreen', function () {
        $('#sidebar').removeClass('fullscreen');
        map.zoomOut(1);
      });

      var rectangles = new L.FeatureGroup().addTo(map);

      // Initialize an empty array of rectangles,
      // it has to be an array for 0rdering issues
      $scope.rectangles = [];

      //Add the draw control
      var drawControl = new L.Control.Draw({
        draw: {
          marker: null,
          polygon: null,
          polyline: null,
          circle: null
        },
        edit: {
          featureGroup: rectangles
        }
      }).addTo(map);

      // Hooks to add created/delete features to the map
      map.on('draw:created', function(e){
        // Push the drawn feature to the angular scope an add it to the map
        $scope.rectangles.push(e.layer);
        e.layer.addTo(rectangles);
        // For some reason the edit buttons are toggled every feature addition
        // we force them to be always active either after a feature add or remove.
        $('.leaflet-draw-toolbar').find('a').removeClass('leaflet-disabled');
        // Make sure the drawn feature is also selected, so highlighted
        e.layer.selectFeature();
      });


      map.on('draw:deleted', function(e){
        $('.leaflet-draw-toolbar').find('a').removeClass('leaflet-disabled');
        // Splice the deleted feature from the angular scope and remove the inner box
        // It has to be aloop because many features can be deleted in a row
        for(var i in e.layers._layers){
          $scope.rectangles.splice($scope.rectangles.indexOf(e.layers._layers[i]),1);
          // remove the deleted feature from the map
          map.removeLayer(e.layers._layers[i].innerBox);
        }
      });

      // Redraw the inner box on edit stop to preserve internal map in case the edit
      // is not saved
      map.on('draw:editstop', function(e){
        for(var i in $scope.rectangles){
          $scope.rectangles[i].updateInnerBox();
        }
      });

      // reset the rectangle styles is the map is clicked (deselect)
      // don't do it if the clicked feature is already selected
      map.deselectAllFeatures = function(current_feature){
        for(var i in $scope.rectangles){
          if ($scope.rectangles[i]._leaflet_id != current_feature._leaflet_id){
            $scope.rectangles[i].deselectFeature();
          }
        }
      }
      // use mousedown instead of click to avoid deselection afterd drawing a new one
      map.on('mousedown', map.deselectAllFeatures);

      // export in kml function
      $scope.exportKml = function(){
        var json = KmlService.serializeJson($scope.rectangles);
        KmlService.requestKml(json);
      }

      $scope.sendKml = function(){
        KmlService.sendKml();
      }

      $scope.zoomAll = function(){
        map.fitBounds(rectangles.getBounds());
      }


      // To Restore form existing KML we pare a GeoJson layer
      // which contains the inner boxses, so we have to recreate the outer map
      // and push it to the rectangles. The inner map will be created by the app
      $scope.$on('kml_loaded', function(event, data){
        L.geoJson(data, {
          onEachFeature: function (feature, layer) {
            var rectangle = InnerMapProvider.outerMap(
              layer.getBounds(),
              feature.properties.format,
              feature.properties.orientation
            )
            rectangle.setStyle({color: '#f06eaa'});

            $scope.rectangles.push(rectangle);
            rectangle.addTo(rectangles);
            rectangle.title = feature.properties.title;
            rectangle.format = feature.properties.format;
            rectangle.orientation = feature.properties.orientation;
            rectangle.scale = feature.properties.scale;
            rectangle.reference = Boolean(feature.properties.reference);
            rectangle.delineation = Boolean(feature.properties.delineation);
            rectangle.grading = Boolean(feature.properties.grading);
          }
        });
      });
    });
  });
})();
