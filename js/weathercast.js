/**
 * Renders the weather cast for a city.
 */

define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

  var CityForecast = Backbone.Model.extend({
      url:'http://api.openweathermap.org/data/2.5/forecast/daily'
  });

  /**
   * The Backbone view
   */
  var WeatherView = Backbone.View.extend({
      /**
       * CSS selector for the form
       * @type {String}
       */
      el:'#weather_cast_form',
      
      /**
       * Initializes the view
       */
      initialize: function() {     
          _.bindAll(this, 'render', 'getStatus');
          this.model = new CityForecast();
          this.listenTo(this.model, "change", this.render);
          this.getStatus();
      },

      /**
       * Event bindings
       * @type {Object}
       */
      events: {
        'click button': 'getStatus'
      },

      /**
       * Fetches the weather from the model
       * @return {bool}
       */
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

      /**
       * Renders the view
       * @return {Backbone.View}
       */
      render: function() {
        $('#pre').text(JSON.stringify(this.model));
        $('#wCast_city').text(this.model.get('city').name + '/' + this.model.get('city').country);
        // $('#wCast_list').text(this.model.get('main').temp);
        var weatherCastList = this.model.get('list');
        $('#wCast_totalDays').text(weatherCastList.length);
        $('#wCast_list').addClass('weather_col_' + weatherCastList.length);
        for (var i = 0; i < weatherCastList.length; i++) {
          // var date = new Date(weatherCastList[i].dt * 1000);
          var date = weatherCastList[i].dt;

          var day_temp = weatherCastList[i].temp.day;
          var night_temp = weatherCastList[i].temp.night;
          var eve_temp = weatherCastList[i].temp.eve;
          var morn_temp = weatherCastList[i].temp.morn;
          var min_temp = weatherCastList[i].temp.min.toString().split(".")[0];
          var max_temp = weatherCastList[i].temp.max.toString().split(".")[0];

          var sky_type = weatherCastList[i].weather[0].icon;
          var weather_desc = weatherCastList[i].weather[0].description;

          var todayWeather;
          if(weatherCastList[i] === 0) {
            todayWeather = ' todayWeather';
          } else {
            todayWeather = '';
          }
          $('#wCast_list').append(
            '<div class="weather_day'+ todayWeather +'">'+
              '<div class="wd_dayofweek"><h6>' + getNiceDate(date, 'dayofweek') + '</h6></div>' + 
              '<div class="wd_date"><h6>' + getNiceDate(date, 'day') + ' ' + getNiceDate(date, 'month') + '</h6></div>' + 
              '<div class="wd_weather_icon">' + 
                '<span class="weather_icon ' + getWeatherIcons(sky_type) + '"></span>' +
                '<span class="weather_temp"><strong><span class="max_temp">' + max_temp + '<span class="degree">&deg;C</span></span><span class="min_temp">' + min_temp + '<span class="degree">&deg;C</span></span></strong></span>' +
              '</div>' + 
              '<div class="weather_desc">' + weather_desc + '</div>' +
            '</div>'
          );

        };
        // $('#weather_wind').text(this.model.get('wind').speed);
        // $('#weather_icon').attr("src", 'http://openweathermap.org/img/w/' + this.model.get('weather')[0].icon + '.png')
        $('.weather_day:first-child').addClass('todayWeather');
        return this;
      }
      
  });    
  
  /**
   * Converts a UNIX timestamp into a nicely formatted Dutch date
   * 
   * @param  {number} dateInput The UNIX timestamp
   * @param  {string} format    The format to use
   * @return {string}           The formatted date
   */
  var getNiceDate = function(dateInput, format) {
    var divider = ' ';

    if(typeof(format)==='undefined') format = 'all';

    var fullDate = new Date(dateInput * 1000);

    var days = ['Monday', 'Tuesday', 'Wednesday ',' Thursday ',' Friday ',' Saturday ',' Sunday '];
    var dayOfWeek = days[fullDate.getDay()];

    var day = fullDate.getDate();

    var months = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sept', 'Okt', 'Nov', 'Dec'];
    var month = months[fullDate.getMonth()];

    var year = fullDate.getFullYear();

    if(format === 'dayofweek'){
      return dayOfWeek;        
    } else if(format === 'day'){
      return day;
    } else if(format === 'month') {
      return month;
    } else if(format === 'year') {
      return year;
    } else if(format === 'all') {
      return dayOfWeek + divider + day + divider + month + divider + year;
    }
  }

  /**
   * Fetches the correct CSS class for a given sky type
   *
   * Images and their meanings:
   * 01d.png  01n.png   sky is clear
   * 02d.png  02n.png   few clouds
   * 03d.png  03n.png   scattered clouds
   * 04d.png  04n.png   broken clouds
   * 09d.png  09n.png   shower rain
   * 10d.png  10n.png   Rain
   * 11d.png  11n.png   Thunderstorm
   * 13d.png  13n.png   snow
   * 50d.png  50n.png   mist
   * 
   * @param  {string} apiResult The sky type
   * @return {string}           The CSS class for the icon
   */
  var getWeatherIcons = function(apiResult) {
    
    var weatherTypesDay = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
    var weatherTypesNight = ['01n', '02n', '03n', '04n', '09n', '10n', '11n', '13n', '50n'];

    var weatherIconsDay = ['wi-day-sunny', 'wi-day-cloudy', 'wi-cloudy', 'wi-day-sprinkle', 'wi-day-showers', 'wi-day-rain', 'wi-day-thunderstorm', 'wi-day-snow', 'wi-day-fog']
    var weatherIconsNight = ['wi-night-clear', 'wi-night-cloudy', ' wi-cloudy', 'wi-night-sprinkle', 'wi-night-showers', 'wi-night-rain', 'wi-night-thunderstorm', 'wi-night-snow', 'wi-night-fog']

    var dayOrNight = apiResult[apiResult.length-1];

    var timeOfWeather;
    var iconOfWeather;

    if(dayOrNight === 'd') {
      timeOfWeather = weatherTypesDay;
      iconOfWeather = weatherIconsDay;
    } else if(dayOrNight === 'n') {
      timeOfWeather = weatherTypesNight;
      iconOfWeather = weatherIconsNight;
    }

    for (var i = 0; i < timeOfWeather.length; i++) {
      var weatherIcon;
      if(timeOfWeather[i] === apiResult) {
        return iconOfWeather[i];
      } else {
      }
    };
  }



  // Initialize and trigger first submit
  $('#weather_city').val('Rotterdam'),
  $('#cnt_4days').attr('checked', 'checked');
  $('#units_metric').attr('checked', 'checked');
  var view = new WeatherView();
  
  $('button').click();

  return WeatherView;
});

