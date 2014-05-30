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
  });
});