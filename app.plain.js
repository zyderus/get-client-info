const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());


app.get('/api', (req, res) => {

  // is client going through a proxy?
  if (req.headers['via']) { // yes
    clientIPaddr = req.headers['x-forwarded-for'] || null;
    clientProxy = req.headers['via'] || null;
  } else { // no
    clientIPaddr = req.connection.remoteAddress || null;
    clientProxy = "none";
  }

  const url = req.url;
  // const pathname = url.parse(req.url).pathname;
  const pathname = url.pathname;
  const headers = req.headers['user-agent'];

  if (pathname!="/favicon.ico") {
    console.log("Request for "+pathname);
    console.log("Client : "+req.headers['user-agent']);
    console.log("IP address "+clientIPaddr+" via proxy "+clientProxy);
  }

  const data = {
    clientProxy,
    clientIPaddr,
    url,
    pathname,
    headers
  };

  res.json(data)
})

app.listen(port, () => console.log(`server is on port: ${port}`));