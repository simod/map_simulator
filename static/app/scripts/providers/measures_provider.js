'use strict';
(function(){
  goog.provide('measures_provider');

  var module = angular.module('measures_provider', []);
  module.provider('MeasuresProvider', function(){

    // A4 measures
    var width = 210; 
    var height = 297;

    this.$get = function(){

      return {
        measures: {
          // A4:{
          //   portrait: {
          //     width: width,
          //     height: height,
          //     inner_box_ratios: {
          //       width: 0.94,
          //       height: 0.72
          //     },
          //     inner_box_offsets: {
          //       top: 146,
          //       left: 18.1
          //     }
          //   },
          //   landscape: {
          //     width: height,
          //     height: width,
          //     inner_box_ratios: {
          //       width: 0.81,
          //       height: 0.94
          //     },
          //     inner_box_offsets: {
          //       top: 18.1,
          //       left: 18.1
          //     }
          //   }
          // },
          // A3: {
          //   portrait: {
          //     width: height,
          //     height: width * 2,
          //     inner_box_ratios: {
          //       width: 0.94,
          //       height: 0.72
          //     },
          //     inner_box_offsets: {
          //       top: 146,
          //       left: 18.1
          //     }
          //   },
          //   landscape: {
          //     width: width * 2,
          //     height: height,
          //     inner_box_ratios: {
          //       width: 0.81,
          //       height: 0.94
          //     },
          //     inner_box_offsets: {
          //       top: 18.1,
          //       left: 18.1
          //     }
          //   }
          // },
          A2: {
            portrait: {
              width: width * 2,
              height: height * 2,
              inner_box_ratios: {
                width: 0.94,
                height: 0.72
              },
              inner_box_offsets: {
                top: 146,
                left: 18.1
              }
            },
            landscape: {
              width: height * 2,
              height: width * 2,
              inner_box_ratios: {
                width: 0.81,
                height: 0.94
              },
              inner_box_offsets: {
                top: 18.1,
                left: 18.1
              }
            }
          },
          A1: {
            portrait: {
              width: height * 2,
              height: width * 4,
              inner_box_ratios: {
                width: 0.94,
                height: 0.72
              },
              inner_box_offsets: {
                top: 146,
                left: 18.1
              }
            },
            landscape: {
              width: width * 4,
              height: height * 2,
              inner_box_ratios: {
                width: 0.81,
                height: 0.94
              },
              inner_box_offsets: {
                top: 18.1,
                left: 18.1
              }
            }
          }
        }
      }
    }
  });
})();