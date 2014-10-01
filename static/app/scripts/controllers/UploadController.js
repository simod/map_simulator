'use strict';
(function(){

  goog.provide('upload_controller');

  goog.require('kml_service');

  var module = angular.module('upload_controller', [
    'kml_service'
  ]);

  module.controller('UploadController', function($scope, KmlService){

    $scope.sendKml = function(){
      var file = $scope.kmlFile;
      var uploadUrl = "/maps/from-kml";
      KmlService.sendKml(file, uploadUrl);
    };

  });
})();