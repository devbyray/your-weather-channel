/**
 * Renders the weather cast for a city.
 */
(function ($) {
// http://api.openweathermap.org/data/2.5/forecast?q=London,us&mode=json
// http://api.openweathermap.org/data/2.5/forecast/daily?q=London

    
    var CityForecast = Backbone.Model.extend({
        url:'http://api.openweathermap.org/data/2.5/forecast/daily'
    });

    var WeatherView = Backbone.View.extend({
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
          $('#wCast_list .weather_day').remove();
          $('#wCast_list').removeClass();
          this.model.fetch({ 
            data : { q: this.$("#weather_city").val(),
            units: this.$('input[name="units"]:checked').val(),
            cnt: this.$('input[name="cnt"]:checked').val()
          }});
          return false;  
        },
        render: function() {
          $('#pre').text(JSON.stringify(this.model));
          $('#wCast_city').text(this.model.get('city').name + '/' + this.model.get('city').country);
          // $('#wCast_list').text(this.model.get('main').temp);
          var weatherCastList = this.model.get('list');
          $('#wCast_totalDays').text(weatherCastList.length);
          $('#wCast_list').addClass('weather_col_' + weatherCastList.length);
          for (var i = 0; i < weatherCastList.length; i++) {
            var date = Date(weatherCastList[i].dt);
            var convertDate = JSON.stringify(date);
            console.log(weatherCastList[i].dt);
            console.log(Date(weatherCastList[i].dt*1000));
            var day_temp = weatherCastList[i].temp.day + '&deg;C';
            var night_temp = weatherCastList[i].temp.night + '&deg;C';
            var eve_temp = weatherCastList[i].temp.eve + '&deg;C';
            var morn_temp = weatherCastList[i].temp.morn + '&deg;C';
            var min_temp = weatherCastList[i].temp.min + '&deg;C';
            var max_temp = weatherCastList[i].temp.max + '&deg;C';
            $('#wCast_list').append(
              '<div class="weather_day">'+
              '<strong>Datum: </strong>' + convertDate + '<br />' + 
              '<strong>Dag temp: </strong>' + day_temp + '<br />' + 
              '<strong>Nacht temp: </strong>' + night_temp + '<br />' + 
              '<strong>Ochtend temp: </strong>' + morn_temp + '<br />' + 
              '<strong>Avond temp: </strong>' + eve_temp + '<br />' + 
              '<strong>Min temp: </strong>' + min_temp + '<br />' + 
              '<strong>Max temp: </strong>' + max_temp + '<br />'+
              '</div>'
            );

          };
          // $('#weather_wind').text(this.model.get('wind').speed);
          // $('#weather_icon').attr("src", 'http://openweathermap.org/img/w/' + this.model.get('weather')[0].icon + '.png')
          return this;
        }
        
    });    

    // Initialize and trigger first submit
    $('#weather_city').val('Rotterdam'),
    $('#cnt_7days').attr('checked', 'checked');
    $('#units_metric').attr('checked', 'checked');
    var view = new WeatherView();
    
    $('button').click();
    
})(jQuery);
