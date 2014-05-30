$(document).ready( function(){
  /**
   * The form is hidden by default
   */
  $('.wCast_form').hide();

  /**
   * If the settings button or form button is clicked than the form and wrapper toggleFade();
   */
  $('#showSettings, button, #closeForm').click( function() {
    $('.wCast_form').fadeToggle('slow');
    $('.wCast_wrapper').fadeToggle('slow');
  });
});