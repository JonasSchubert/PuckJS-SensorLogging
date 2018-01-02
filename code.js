// Code to read out magnetometer for x, y and z
/*
Puck.magOn();
Puck.on('mag', function(values) {
  console.log(values);
});
*/

//Code to read out light sensor
/*
Puck.light();
*/

//Code to read out temperature
/*
E.getTemperature();
*/

//Code to read out battery level
/*
Puck.getBatteryPercentage();
*/

//Code for NFC - Near field communication
/*
NRF.nfcURL("http://192.168.178.25");
*/

//Code for iBeacons
/*
require("ble_ibeacon").advertise({
  uuid: [0, 2, 0, 1, 1, 9, 9, 0, 0, 2, 0, 1, 1, 9, 9, 0]
});
*/

//Another code for Beacons (Eddystone)
/*
NRF.setAdvertising([
  require("ble_ibeacon").get({
    uuid: [0, 2, 0, 1, 1, 9, 9, 0, 0, 2, 0, 1, 1, 9, 9, 0]
  }),
  require("ble_eddystone").get("192.168.178.25")
  ], {interval:250});
*/

//Broadcast LucaHome IP
// NRF.nfcURL("http://192.168.178.25");

//Places of the PuckJS in my flat
//var places = ["Hall", "Bath", "Sleeping_Room", "Living_Room", "Kitchen"];

//Advertise place, temperature, light, battery percentage and mag values via NRF
setInterval(function() {
  //var magValue = Puck.mag();
  //var magString = "x: " + String(magValue.x) + "&y:" + String(magValue.y) + "&z:" + String(magValue.z);
  // Max advertising values are four (!?)
  NRF.setAdvertising({
    0x1809: [Math.round(E.getTemperature())],
    0x1819: [Puck.light() * 100],
    0x1829: [Puck.getBatteryPercentage()]//,
    //0x1839: [magString]
  });
}, 30000);