require('dotenv').config()
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/",function(req,res){
  const city =req.body.cityName;
  const country = req.body.countryCode;
  const query = city + ","+ country ;
  const units ="metric";
  const apikey = process.env.API;

  const url ="https://api.openweathermap.org/data/2.5/weather?q="+ query +",&units=" + units +"&appid="+ apikey+"";

  https.get(url , function(response) {

    console.log(response.statusCode);

    response.on("data",function(data){
    const weatherData= JSON.parse(data);
    console.log(weatherData);
    const temp = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const image ="http://openweathermap.org/img/wn/"+ icon +"@2x.png" ;
    res.write("<p> The weather is currently "+ weatherDescription + "</p>");
    res.write("<h1> The temperature in "+ query +" is " + temp + "degrees Celsious.</h1>");
    res.write("<img src = "+ image + ">");
    res.send()
   })
  })
})


app.listen(3000, function() {
  console.log("server is running on port 3000 ");
});
