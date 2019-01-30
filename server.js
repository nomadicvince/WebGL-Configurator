const express = require('express');
const app = express();

//Server static filess
app.use(express.static('public'));
app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('textures'));

//add the router
app.listen(process.env.port || 6969);
console.log('Running at Port 6969');