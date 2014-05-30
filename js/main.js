$(document).ready( function(){
  $('.wCast_form').hide();
  $('#showSettings, button').click( function() {
    $('.wCast_form').fadeToggle('slow');
    $('.wCast_wrapper').fadeToggle('slow');
  });
});