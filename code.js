// Code to read out magnetometer for x, y and z
/*
Puck.magOn();
Puck.on('mag', function(values) {
  console.log(values);
});
*/

// Code to read out light sensor
/*
Puck.light();
*/

// Code to read out temperature
/*
E.getTemperature();
*/

// Code to read out battery level
/*
Puck.getBatteryPercentage();
*/

// Code for NFC - Near field communication
/*
NRF.nfcURL("http://192.168.178.25");
*/

// Code for iBeacons
/*
require("ble_ibeacon").advertise({
  uuid: [0, 2, 0, 1, 1, 9, 9, 0, 0, 2, 0, 1, 1, 9, 9, 0]
});
*/

// Another code for Beacons (Eddystone)
/*
NRF.setAdvertising([
  require("ble_ibeacon").get({
    uuid: [0, 2, 0, 1, 1, 9, 9, 0, 0, 2, 0, 1, 1, 9, 9, 0]
  }),
  require("ble_eddystone").get("192.168.178.25")
  ], {interval:250});
*/

// Broadcast LucaHome IP
// NRF.nfcURL("http://192.168.178.25");

// Places of the PuckJS in my flat
// const places = ["Hallway", "Bath", "Bedroom", "Living Room", "Kitchen"];

// Instances
/*
const instances = [
  "0x53, 0x69, 0x6e, 0x74, 0x68, 0x73", // Hallway      B8E
  "0x53, 0x69, 0x6e, 0x74, 0x68, 0x72", // Bath         E4D
  "0x53, 0x69, 0x6e, 0x74, 0x68, 0x71", // Bedroom      BF7
  "0x53, 0x69, 0x6e, 0x74, 0x68, 0x75", // Living Room  448
  "0x53, 0x69, 0x6e, 0x74, 0x68, 0x74"  // Kitchen      FEE
];
*/

// Advertise place, temperature, light, battery percentage and mag values via NRF
setInterval(() => {
  // const magValue = Puck.mag();
  // const magString = "x: " + String(magValue.x) + "&y:" + String(magValue.y) + "&z:" + String(magValue.z);
  // TODO: Question: Max advertising values are four!?

  const battery = Puck.getBatteryPercentage();

  if (battery < 10) {
    LED1.write(true);
  }

  // https://www.bluetooth.com/specifications/gatt/services/
  NRF.setAdvertising(
    [
      require("ble_eddystone_uid").get(
        [0x4c, 0x75, 0x63, 0x61, 0x48, 0x6f, 0x6d, 0x65, 0x32, 0x30], // namespace
        [0x53, 0x69, 0x6e, 0x74, 0x68, 0x73]                          // instance
      ),
      {
        0x1809: [Math.round(E.getTemperature())], // Health Thermometer
        0x180F: [battery],                        // Battery Service
        0x181A: [Puck.light() * 100],             // Environmental Sensing
      }
    ]
  );
}, 1000);
