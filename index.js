// Import stylesheets
import './style.css';

const L = require("leaflet");

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<div id="map"></div>`;

// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
  center: [51.505, -0.09],
  zoom: 13
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// create a red polygon from an array of LatLng points
var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];

var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);

function onMapClick(e) {
  alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);

// zoom the map to the polygon
map.fitBounds(polygon.getBounds());

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     mediaUrl: `["https://images.unsplash.com/photo-1545093149-618ce3bcf49d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"]`,
     from: 'whatsapp:+14155238886',
     to: 'whatsapp:+15017122661'
   })
  .then(message => console.log(message.sid));


// You can find your Twilio Auth Token here: https://www.twilio.com/console
// Set at runtime as follows:
// $ TWILIO_AUTH_TOKEN=XXXXXXXXXXXXXXXXXXX node index.js
//
// This will not work unless you set the TWILIO_AUTH_TOKEN environment
// variable.

const twilio = require('twilio');
const app = require('express')();
const bodyParser = require('body-parser');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const shouldValidate = process.env.NODE_ENV !== 'test';

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/voice', twilio.webhook({ validate: shouldValidate }), (req, res) => {
  // Twilio Voice URL - receives incoming calls from Twilio
  const response = new VoiceResponse();

  response.say(
    `Thanks for calling!
     Your phone number is ${req.body.From}. I got your call because of Twilio´s
     webhook. Goodbye!`
  );

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
});

app.post(
  '/message',
  twilio.webhook({ validate: shouldValidate }),
  (req, res) => {
    // Twilio Messaging URL - receives incoming messages from Twilio
    const response = new MessagingResponse();

    response.message(`Your text to me was ${req.body.Body
      .length} characters long.
                    Webhooks are neat :)`);

    res.set('Content-Type', 'text/xml');
    res.send(response.toString());
  }
);

app.listen(3000);


