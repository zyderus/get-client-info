const express = require('express');
const parser = require('ua-parser-js');
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.static(__dirname));

// app.get('/', (req, res) => {

// });

app.get('/api', (req, res) => {

  // get user-agent header
  var ua = parser(req.headers['user-agent']);
  if (req.headers['via']) { // yes
    ua.ip = req.headers['x-forwarded-for'] || null;
    ua.proxy = req.headers['via'] || null;
  } else { // no
    ua.ip = req.connection.remoteAddress || null;
    ua.proxy = "none";
  }
  // write the result as response
  res.end(JSON.stringify(ua, null, '  '));
})

app.listen(port, () => console.log(`server is on port: ${port}`));

// REQUESTIP AS MIDDLEWARE
// const ipMiddleware = function(req, res, next) {
//   clientIp = requestIp.getClientIp(req);  // Extract client IP
//   next();
// };