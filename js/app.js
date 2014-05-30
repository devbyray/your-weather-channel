// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'weathercast', // Request weathercast.js
], function($, _, Backbone, weathercast){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    weathercast.WeatherView;
  };

  return { 
    initialize: initialize
  };
});