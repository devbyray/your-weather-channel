/**
 * Renders the weather cast for a city.
 */

define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){

  var CityForecast = Backbone.Model.extend({
      url:'http://api.openweathermap.org/data/2.5/forecast/daily'
  });

  var Countries = Backbone.Model.extend({
      url:'/models/countries.json'
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
        $('#preloader').delay(100).fadeIn('slow');
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
        // $('#pre').text(JSON.stringify(this.model));
        var currentCountry = this.model.get('city').country;
        $('#wCast_city').text(this.model.get('city').name + '/' + currentCountry);
        // $('#wCast_list').text(this.model.get('main').temp);
        getCountryBackground(currentCountry);
        var weatherCastList = this.model.get('list');

        $('#wCast_totalDays').text(weatherCastList.length);
        $('#preloader').delay(100).fadeOut('slow');
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

  // var CountriesList = Backbone.Model.extend({
  //     countries: [
  //         {name: "Afghanistan", code: "AF"}, 
  //         {name: "Åland Islands", code: "AX"}, 
  //         {name: "Albania", code: "AL"}, 
  //         {name: "Algeria", code: "DZ"}, 
  //         {name: "American Samoa", code: "AS"}, 
  //         {name: "AndorrA", code: "AD"}, 
  //         {name: "Angola", code: "AO"}, 
  //         {name: "Anguilla", code: "AI"}, 
  //         {name: "Antarctica", code: "AQ"}, 
  //         {name: "Antigua and Barbuda", code: "AG"}, 
  //         {name: "Argentina", code: "AR"}, 
  //         {name: "Armenia", code: "AM"}, 
  //         {name: "Aruba", code: "AW"}, 
  //         {name: "Australia", code: "AU"}, 
  //         {name: "Austria", code: "AT"}, 
  //         {name: "Azerbaijan", code: "AZ"}, 
  //         {name: "Bahamas", code: "BS"}, 
  //         {name: "Bahrain", code: "BH"}, 
  //         {name: "Bangladesh", code: "BD"}, 
  //         {name: "Barbados", code: "BB"}, 
  //         {name: "Belarus", code: "BY"}, 
  //         {name: "Belgium", code: "BE"}, 
  //         {name: "Belize", code: "BZ"}, 
  //         {name: "Benin", code: "BJ"}, 
  //         {name: "Bermuda", code: "BM"}, 
  //         {name: "Bhutan", code: "BT"}, 
  //         {name: "Bolivia", code: "BO"}, 
  //         {name: "Bosnia and Herzegovina", code: "BA"}, 
  //         {name: "Botswana", code: "BW"}, 
  //         {name: "Bouvet Island", code: "BV"}, 
  //         {name: "Brazil", code: "BR"}, 
  //         {name: "British Indian Ocean Territory", code: "IO"}, 
  //         {name: "Brunei Darussalam", code: "BN"}, 
  //         {name: "Bulgaria", code: "BG"}, 
  //         {name: "Burkina Faso", code: "BF"}, 
  //         {name: "Burundi", code: "BI"}, 
  //         {name: "Cambodia", code: "KH"}, 
  //         {name: "Cameroon", code: "CM"}, 
  //         {name: "Canada", code: "CA"}, 
  //         {name: "Cape Verde", code: "CV"}, 
  //         {name: "Cayman Islands", code: "KY"}, 
  //         {name: "Central African Republic", code: "CF"}, 
  //         {name: "Chad", code: "TD"}, 
  //         {name: "Chile", code: "CL"}, 
  //         {name: "China", code: "CN"}, 
  //         {name: "Christmas Island", code: "CX"}, 
  //         {name: "Cocos (Keeling) Islands", code: "CC"}, 
  //         {name: "Colombia", code: "CO"}, 
  //         {name: "Comoros", code: "KM"}, 
  //         {name: "Congo", code: "CG"}, 
  //         {name: "Congo, The Democratic Republic of the", code: "CD"}, 
  //         {name: "Cook Islands", code: "CK"}, 
  //         {name: "Costa Rica", code: "CR"}, 
  //         {name: "Cote D'Ivoire", code: "CI"}, 
  //         {name: "Croatia", code: "HR"}, 
  //         {name: "Cuba", code: "CU"}, 
  //         {name: "Cyprus", code: "CY"}, 
  //         {name: "Czech Republic", code: "CZ"}, 
  //         {name: "Denmark", code: "DK"}, 
  //         {name: "Djibouti", code: "DJ"}, 
  //         {name: "Dominica", code: "DM"}, 
  //         {name: "Dominican Republic", code: "DO"}, 
  //         {name: "Ecuador", code: "EC"}, 
  //         {name: "Egypt", code: "EG"}, 
  //         {name: "El Salvador", code: "SV"}, 
  //         {name: "Equatorial Guinea", code: "GQ"}, 
  //         {name: "Eritrea", code: "ER"}, 
  //         {name: "Estonia", code: "EE"}, 
  //         {name: "Ethiopia", code: "ET"}, 
  //         {name: "Falkland Islands (Malvinas)", code: "FK"}, 
  //         {name: "Faroe Islands", code: "FO"}, 
  //         {name: "Fiji", code: "FJ"}, 
  //         {name: "Finland", code: "FI"}, 
  //         {name: "France", code: "FR"}, 
  //         {name: "French Guiana", code: "GF"}, 
  //         {name: "French Polynesia", code: "PF"}, 
  //         {name: "French Southern Territories", code: "TF"}, 
  //         {name: "Gabon", code: "GA"}, 
  //         {name: "Gambia", code: "GM"}, 
  //         {name: "Georgia", code: "GE"}, 
  //         {name: "Germany", code: "DE"}, 
  //         {name: "Ghana", code: "GH"}, 
  //         {name: "Gibraltar", code: "GI"}, 
  //         {name: "Greece", code: "GR"}, 
  //         {name: "Greenland", code: "GL"}, 
  //         {name: "Grenada", code: "GD"}, 
  //         {name: "Guadeloupe", code: "GP"}, 
  //         {name: "Guam", code: "GU"}, 
  //         {name: "Guatemala", code: "GT"}, 
  //         {name: "Guernsey", code: "GG"}, 
  //         {name: "Guinea", code: "GN"}, 
  //         {name: "Guinea-Bissau", code: "GW"}, 
  //         {name: "Guyana", code: "GY"}, 
  //         {name: "Haiti", code: "HT"}, 
  //         {name: "Heard Island and Mcdonald Islands", code: "HM"}, 
  //         {name: "Holy See (Vatican City State)", code: "VA"}, 
  //         {name: "Honduras", code: "HN"}, 
  //         {name: "Hong Kong", code: "HK"}, 
  //         {name: "Hungary", code: "HU"}, 
  //         {name: "Iceland", code: "IS"}, 
  //         {name: "India", code: "IN"}, 
  //         {name: "Indonesia", code: "ID"}, 
  //         {name: "Iran, Islamic Republic Of", code: "IR"}, 
  //         {name: "Iraq", code: "IQ"}, 
  //         {name: "Ireland", code: "IE"}, 
  //         {name: "Isle of Man", code: "IM"}, 
  //         {name: "Israel", code: "IL"}, 
  //         {name: "Italy", code: "IT"}, 
  //         {name: "Jamaica", code: "JM"}, 
  //         {name: "Japan", code: "JP"}, 
  //         {name: "Jersey", code: "JE"}, 
  //         {name: "Jordan", code: "JO"}, 
  //         {name: "Kazakhstan", code: "KZ"}, 
  //         {name: "Kenya", code: "KE"}, 
  //         {name: "Kiribati", code: "KI"}, 
  //         {name: "Korea, Democratic People'S Republic of", code: "KP"}, 
  //         {name: "Korea, Republic of", code: "KR"}, 
  //         {name: "Kuwait", code: "KW"}, 
  //         {name: "Kyrgyzstan", code: "KG"}, 
  //         {name: "Lao People'S Democratic Republic", code: "LA"}, 
  //         {name: "Latvia", code: "LV"}, 
  //         {name: "Lebanon", code: "LB"}, 
  //         {name: "Lesotho", code: "LS"}, 
  //         {name: "Liberia", code: "LR"}, 
  //         {name: "Libyan Arab Jamahiriya", code: "LY"}, 
  //         {name: "Liechtenstein", code: "LI"}, 
  //         {name: "Lithuania", code: "LT"}, 
  //         {name: "Luxembourg", code: "LU"}, 
  //         {name: "Macao", code: "MO"}, 
  //         {name: "Macedonia, The Former Yugoslav Republic of", code: "MK"}, 
  //         {name: "Madagascar", code: "MG"}, 
  //         {name: "Malawi", code: "MW"}, 
  //         {name: "Malaysia", code: "MY"}, 
  //         {name: "Maldives", code: "MV"}, 
  //         {name: "Mali", code: "ML"}, 
  //         {name: "Malta", code: "MT"}, 
  //         {name: "Marshall Islands", code: "MH"}, 
  //         {name: "Martinique", code: "MQ"}, 
  //         {name: "Mauritania", code: "MR"}, 
  //         {name: "Mauritius", code: "MU"}, 
  //         {name: "Mayotte", code: "YT"}, 
  //         {name: "Mexico", code: "MX"}, 
  //         {name: "Micronesia, Federated States of", code: "FM"}, 
  //         {name: "Moldova, Republic of", code: "MD"}, 
  //         {name: "Monaco", code: "MC"}, 
  //         {name: "Mongolia", code: "MN"}, 
  //         {name: "Montserrat", code: "MS"}, 
  //         {name: "Morocco", code: "MA"}, 
  //         {name: "Mozambique", code: "MZ"}, 
  //         {name: "Myanmar", code: "MM"}, 
  //         {name: "Namibia", code: "NA"}, 
  //         {name: "Nauru", code: "NR"}, 
  //         {name: "Nepal", code: "NP"}, 
  //         {name: "Netherlands", code: "NL"}, 
  //         {name: "Netherlands Antilles", code: "AN"}, 
  //         {name: "New Caledonia", code: "NC"}, 
  //         {name: "New Zealand", code: "NZ"}, 
  //         {name: "Nicaragua", code: "NI"}, 
  //         {name: "Niger", code: "NE"}, 
  //         {name: "Nigeria", code: "NG"}, 
  //         {name: "Niue", code: "NU"}, 
  //         {name: "Norfolk Island", code: "NF"}, 
  //         {name: "Northern Mariana Islands", code: "MP"}, 
  //         {name: "Norway", code: "NO"}, 
  //         {name: "Oman", code: "OM"}, 
  //         {name: "Pakistan", code: "PK"}, 
  //         {name: "Palau", code: "PW"}, 
  //         {name: "Palestinian Territory, Occupied", code: "PS"}, 
  //         {name: "Panama", code: "PA"}, 
  //         {name: "Papua New Guinea", code: "PG"}, 
  //         {name: "Paraguay", code: "PY"}, 
  //         {name: "Peru", code: "PE"}, 
  //         {name: "Philippines", code: "PH"}, 
  //         {name: "Pitcairn", code: "PN"}, 
  //         {name: "Poland", code: "PL"}, 
  //         {name: "Portugal", code: "PT"}, 
  //         {name: "Puerto Rico", code: "PR"}, 
  //         {name: "Qatar", code: "QA"}, 
  //         {name: "Reunion", code: "RE"}, 
  //         {name: "Romania", code: "RO"}, 
  //         {name: "Russian Federation", code: "RU"}, 
  //         {name: "RWANDA", code: "RW"}, 
  //         {name: "Saint Helena", code: "SH"}, 
  //         {name: "Saint Kitts and Nevis", code: "KN"}, 
  //         {name: "Saint Lucia", code: "LC"}, 
  //         {name: "Saint Pierre and Miquelon", code: "PM"}, 
  //         {name: "Saint Vincent and the Grenadines", code: "VC"}, 
  //         {name: "Samoa", code: "WS"}, 
  //         {name: "San Marino", code: "SM"}, 
  //         {name: "Sao Tome and Principe", code: "ST"}, 
  //         {name: "Saudi Arabia", code: "SA"}, 
  //         {name: "Senegal", code: "SN"}, 
  //         {name: "Serbia and Montenegro", code: "CS"}, 
  //         {name: "Seychelles", code: "SC"}, 
  //         {name: "Sierra Leone", code: "SL"}, 
  //         {name: "Singapore", code: "SG"}, 
  //         {name: "Slovakia", code: "SK"}, 
  //         {name: "Slovenia", code: "SI"}, 
  //         {name: "Solomon Islands", code: "SB"}, 
  //         {name: "Somalia", code: "SO"}, 
  //         {name: "South Africa", code: "ZA"}, 
  //         {name: "South Georgia and the South Sandwich Islands", code: "GS"}, 
  //         {name: "Spain", code: "ES"}, 
  //         {name: "Sri Lanka", code: "LK"}, 
  //         {name: "Sudan", code: "SD"}, 
  //         {name: "Suriname", code: "SR"}, 
  //         {name: "Svalbard and Jan Mayen", code: "SJ"}, 
  //         {name: "Swaziland", code: "SZ"}, 
  //         {name: "Sweden", code: "SE"}, 
  //         {name: "Switzerland", code: "CH"}, 
  //         {name: "Syrian Arab Republic", code: "SY"}, 
  //         {name: "Taiwan, Province of China", code: "TW"}, 
  //         {name: "Tajikistan", code: "TJ"}, 
  //         {name: "Tanzania, United Republic of", code: "TZ"}, 
  //         {name: "Thailand", code: "TH"}, 
  //         {name: "Timor-Leste", code: "TL"}, 
  //         {name: "Togo", code: "TG"}, 
  //         {name: "Tokelau", code: "TK"}, 
  //         {name: "Tonga", code: "TO"}, 
  //         {name: "Trinidad and Tobago", code: "TT"}, 
  //         {name: "Tunisia", code: "TN"}, 
  //         {name: "Turkey", code: "TR"}, 
  //         {name: "Turkmenistan", code: "TM"}, 
  //         {name: "Turks and Caicos Islands", code: "TC"}, 
  //         {name: "Tuvalu", code: "TV"}, 
  //         {name: "Uganda", code: "UG"}, 
  //         {name: "Ukraine", code: "UA"}, 
  //         {name: "United Arab Emirates", code: "AE"}, 
  //         {name: "United Kingdom", code: "GB"}, 
  //         {name: "United States", code: "US"}, 
  //         {name: "United States Minor Outlying Islands", code: "UM"}, 
  //         {name: "Uruguay", code: "UY"}, 
  //         {name: "Uzbekistan", code: "UZ"}, 
  //         {name: "Vanuatu", code: "VU"}, 
  //         {name: "Venezuela", code: "VE"}, 
  //         {name: "Viet Nam", code: "VN"}, 
  //         {name: "Virgin Islands, British", code: "VG"}, 
  //         {name: "Virgin Islands, U.S.", code: "VI"}, 
  //         {name: "Wallis and Futuna", code: "WF"}, 
  //         {name: "Western Sahara", code: "EH"}, 
  //         {name: "Yemen", code: "YE"}, 
  //         {name: "Zambia", code: "ZM"}, 
  //         {name: "Zimbabwe", code: "ZW'}
  //     ]
  // });

  // var countries = new Countries();
  // console.log(countries[0]);


  var getCountryBackground = function(country) {
      console.log('inside function');
      $('html').removeClass('count-background');
      $('html').css('background-image', 'none');
      country = country.toLowerCase();
      $('html').addClass('count-background');
      $('html').css('background-image', 'url(backgrounds/' + country + '_background.jpg)')
  }



  // Initialize and trigger first submit
  $('#weather_city').val('Rotterdam'),
  $('#cnt_4days').attr('checked', 'checked');
  $('#units_metric').attr('checked', 'checked');
  var view = new WeatherView();
  
  $('button').click();

  return WeatherView;
});

