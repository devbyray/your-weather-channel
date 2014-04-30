/**
 * Renders the weather status for a city.
 */
(function ($) {
    
    var City = Backbone.Model.extend({
        url:'http://api.openweathermap.org/data/2.5/weather',
    });
    var CityForecast = Backbone.Model.extend({
        url:'http://api.openweathermap.org/data/2.5/forecast/daily',
    });

    var WeatherView = Backbone.View.extend({
        el:'#weather_status_form',
        initialize: function() {     
            _.bindAll(this, 'render', 'getStatus');
            this.model = new City();
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
          $('#weather_description').text(this.model.get('weather')[0].description);
          $('#weather_temp').text(this.model.get('main').temp);
          $('#weather_wind').text(this.model.get('wind').speed);
          $('#weather_icon').attr("src", 'http://openweathermap.org/img/w/' + this.model.get('weather')[0].icon + '.png')
          return this;
        }
        
    });

    // var WeatherForecast = Backbone.View.$.extend({
    //   el: '#weather_forecast_form',
    //     initialize: function() {     
    //         _.bindAll(this, 'render', 'getForecast');
    //         this.model = new CityForecast();
    //         this.listenTo(this.model, "change", this.render);
    //         this.getStatus();
    //     },
    //     events: {
    //       'click button': 'getForecast'
    //     },
    //     getForecast: function(){
    //       this.model.fetch({ 
    //         data : { q: this.$("#weather_city").val(),
    //         units: this.$('input[name="units"]:checked').val()
    //       }});
    //       return false;  
    //     },
    //     render: function() {
    //       $('#weather_description').text(this.model.get('weather')[0].description);
    //       $('#weather_temp').text(this.model.get('main').temp);
    //       $('#weather_wind').text(this.model.get('wind').speed);
    //       return this;
    //     }
    // });
    

    // Initialize and trigger first submit
    $('#weather_city').val('Madrid'),
    $('#units_metric').attr('checked', 'checked');
    var view = new WeatherView();
    
    $('button').click();
    
})(jQuery);
  