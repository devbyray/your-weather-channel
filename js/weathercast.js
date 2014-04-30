/**
 * Renders the weather status for a city.
 */
(function ($) {
    
    var CityForecast = Backbone.Model.extend({
        url:'http://api.openweathermap.org/data/2.5/forecast/daily',
    });

    var WeatherCastView = Backbone.View.extend({
        el:'#weather_cast_form',
        initialize: function() {     
            _.bindAll(this, 'render', 'getStatus');
            this.model = new CityForecast();
            this.listenTo(this.model, "change", this.render);
            this.getStatus();
        },
        events: {
          'click button': 'getStatus'
        },
        getStatus: function(){
          this.model.fetch({ 
            data : { q: this.$("#weather_city").val(),
            units: this.$('input[name="units"]:checked').val()
          }});
          return false;  
        },
        render: function() {
          // This is just only for 1 day
          $('#wCast_city').text(this.model.get('city').name);
          $('#wCast_day_temp').text(this.model.get('list')[0].temp.day);
          $('#wCast_min_temp').text(this.model.get('list')[0].temp.min);
          $('#wCast_max_temp').text(this.model.get('list')[0].temp.max);
          $('#wCast_night_temp').text(this.model.get('list')[0].temp.night);
          $('#wCast_eve_temp').text(this.model.get('list')[0].temp.eve);
          $('#wCast_morn_temp').text(this.model.get('list')[0].temp.morn);
          $('#wCast_pressure').text(this.model.get('list')[0].pressure);
          $('#wCast_humidity').text(this.model.get('list')[0].pressure);
          $('#wCast_pressure').text(this.model.get('list')[0].pressure);


          $('#weather_cast_description').text(this.model.get('weather')[0].description);
          $('#weather_cast_temp').text(this.model.get('main').temp);
          $('#weather_cast_wind').text(this.model.get('wind').speed);
          $('#weather_cast_icon').attr("src", 'http://openweathermap.org/img/w/' + this.model.get('weather')[0].icon + '.png')
          return this;
        }
        
    });    

    // Initialize and trigger first submit
    $('#weather_cast_city').val('Madrid'),
    $('#units_cast_metric').attr('checked', 'checked');
    var view = new WeatherCastView();
    
    $('#weather_cast_form button').click();
    
})(jQuery);
  