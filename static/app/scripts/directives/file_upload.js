'use strict';
(function(){

  goog.provide('upload_directive');

  var module = angular.module('upload_directive', []);

  module.directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        
        element.bind('change', function(){
          scope.$apply(function(){
              var filename = element[0].files[0].name.split('.');
              if (filename[filename.length - 1] === 'kml'){
                modelSetter(scope, element[0].files[0]);
              }
              else{
                alert('Invalid file extension, only "kml" is allowed');
              }
          });
        });
      }
    };
  }]);
})();