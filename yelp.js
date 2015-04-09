//var geocoder;
var map;
var ne;
var sw;
var sw_latitude;
var sw_longitude;
var ne_latitude;
var ne_longitude;
var marker;

function initialize() {
  var mapOptions = {
    zoom: 16,
    center: new google.maps.LatLng(32.75, -97.13)
  };
     // geocoder = new google.maps.Geocoder();
      map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
      google.maps.event.addListener(map, 'idle', function(){
      var initialBounds;
      initialBounds = map.getBounds(); 
   //             alert(map.getBounds());
                var ne = initialBounds.getNorthEast();
                var sw = initialBounds.getSouthWest();
                 ne_latitude = ne.lat();
                 ne_longitude = ne.lng();
                 sw_latitude = sw.lat();
                 sw_longitude = sw.lng();
      });
  }

function sendRequest () {
   var xhr = new XMLHttpRequest();
   var restaurant_term = document.getElementById('search').value;
   
   xhr.open("GET", "proxy.php?term="+restaurant_term+"&bounds="+sw_latitude+","+sw_longitude+"|"+ne_latitude+","+ne_longitude+"&limit=10");//set intial latitude and longitide
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          //var str = JSON.stringify(json,undefined,2);
          //alert(JSON.stringify(json,undefined,2));
          var out = "<div style='border: 1px solid black;'> ";//for table field 
          for(i = 0; i < json.businesses.length; i++) {
           out += "<div style='border: 1px solid black;'> " +
           json.businesses[i].name +
           "</div><div><img src="+json.businesses[i].image_url+" alt="+json.businesses[i].name+"</div>"  +//image url 
           "<div><img src="+json.businesses[i].rating_img_url+" alt="+json.businesses[i].name+"</div><div>"  +// name 
           json.businesses[i].location.display_address+//address
           "</div></div>";
            }
          out += "</div>"
            //codeAddress(json.businesses[1].location.display_address);
            codeAddress(json);
          document.getElementById("output").innerHTML = "<pre>" + out + "</pre>";
       }
   };
   xhr.send(null);
}

function codeAddress(NewJson) {
  //alert("function call"+NewJson.businesses.length);
  var geocoder;
  var map;
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(32.75, -97.13);
  var mapOptions = {
    zoom: 16,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  var address;
  for(var i1=0; i1<NewJson.businesses.length; i1++){
       address=NewJson.businesses[i1].location.postal_code+","+NewJson.businesses[i1].location.address+","+NewJson.businesses[i1].location.state_code;  
       //}
      geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          icon: "http://google.com/mapfiles/kml/paddle/"+i1+".png"
      });
    }
  });
  }
}
google.maps.event.addDomListener(window, 'load', initialize);
