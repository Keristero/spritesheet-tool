const express = require('express');
const app = express();
const port = 80

app.use(express.static('.'))

app.listen(port, () => console.log(`tool webserver listening on port ${port}`));