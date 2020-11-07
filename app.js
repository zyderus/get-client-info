const express = require('express');
const parser = require('ua-parser-js');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.static(__dirname));

// get Client info to backend
app.get('/api', async (req, res) => {
  const ua = await getClientInfo(req);
  
  ua.data = await ipLookUp(ua.ip);
  // write the result as response
  res.end(JSON.stringify(ua, null, '  '));
});

// Google geocode API proxy
app.get('/geocode', async (req, res) => {
  const latlng = req.query.latlng;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${process.env.GOOGLE_GEOCODE_KEY}`;
  
  const data = await fetchGeocode(url);
  console.log(data.results[0]);
  res.json(data.results[0]);
});

app.listen(port, () => console.log(`server is on port: ${port}`));


// Lookup via geo ip service
async function ipLookUp(ip) {

  const url       = `http://ip-api.com/json/${ip}`;             // 45 requests per minute
  const url_free  = `http://geolocation-db.com/jsonp/${ip}`;    // free and slow (CORS errors)
  
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

// Get reverse geocode data based on lat and lng from google
async function fetchGeocode(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

// Parse client request data
function getClientInfo(req) {
  // get user-agent header
  let ua = parser(req.headers['user-agent']);
  ua.timestamp = Date.now();
  // add IP and Proxy
  if (req.headers['via']) { // yes
    ua.ip = req.headers['x-forwarded-for'] || null;
    ua.proxy = req.headers['via'] || null;
  } else { // no
    ua.ip = req.connection.remoteAddress || null;
    ua.proxy = "none";
  }
  return ua;
}


// REQUESTIP AS MIDDLEWARE
// const ipMiddleware = function(req, res, next) {
//   clientIp = requestIp.getClientIp(req);  // Extract client IP
//   next();
// };