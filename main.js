/* FRONTEND IP LOCATION */
geoLocate();

// Use HTML5 Geolocation
function geoLocate() {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
    return;
  }

  function success(position) {
    // for when getting location is a success
    const lat  = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log('latitude', lat, 'longitude', lon);
    reverseGeocode(lat, lon);
  }

  function error() {
    // for when getting location results in an error
    console.error('Cannot retrieve your position. Please enable geolocation in your browser');
    // get your location some other way
    return ipLookUp();
  }

  navigator.geolocation.getCurrentPosition(success, error);
}

// Lookup via geo ip service
async function ipLookUp() {

  const url       = 'http://ip-api.com/json';             // 45 requests per minute
  const url_free  = 'http://geolocation-db.com/jsonp';    // free and slow (CORS errors)
  
  const response = await fetch(url);
  const data = await response.json()
  .then(
    function success(data) {
      console.log('User\'s Location Data is ', data);
      console.log('User\'s Country', data.country);
    },

    function fail(data, status) {
      console.log('Request failed.  Returned status of', status);
    }
  );
}
// ipLookUp();

async function reverseGeocode(lat, lon) {
  const url = `/geocode?latlng=${lat},${lon}`;

  const response = await fetch(url);
  const data = await response.json();

  console.log('url sent: ', url);
  console.log('data received: ', data);
}