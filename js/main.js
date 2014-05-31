// Author: Raymon Schouwenaar @rsschouwenaar
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jquery: 'vendor/jquery',
    underscore: 'vendor/underscore',
    backbone: 'vendor/backbone',
    modernizr: 'vendor/modernizr',
  }

});

require([
  // Load our app module and pass it to our definition function
  'app',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
  $(document).ready( function(){
    /**
     * The form is hidden by default
     */
    $('#overlay').hide();

    /**
     * If the settings button or form button is clicked than the form and wrapper toggleFade();
     */
    $('#showSettings, button, #closeForm').click( function() {
      $('#overlay').fadeToggle('slow');
      $('#page_header').toggleClass('zindex');
    });
  });
});