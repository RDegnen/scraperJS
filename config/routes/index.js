const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.writeHead(200);
  res.write("<!DOCTYPE html><html><body>"+
    "<style>body{text-align: center;}a{color: #000000;border: 1px solid black;padding: 10px 30px;text-decoration: none;margin-top: 10em;display: inline-block;font-size: 20px;transition: all .5s;}"+
    "a:hover{background-color: black;color: white;}"+
    "</style>"+
    "<a href='login'>Login!</a></body></html>");
  res.end();
});

module.exports = router;
