/**
 * https://www.bluetooth.com/specifications/gatt/services/
 * https://github.com/reelyactive/puckyactive-firmware/blob/master/eddystone-tlm.js
 */

/**
 * UID Related constants
 */
const NAMESPACE = [0x4c, 0x75, 0x63, 0x61, 0x48, 0x6f, 0x6d, 0x65, 0x32, 0x30];
const INSTANCES = [
  [0x53, 0x69, 0x6e, 0x74, 0x68, 0x73], // Hallway      B8E
  [0x53, 0x69, 0x6e, 0x74, 0x68, 0x72], // Bath         E4D
  [0x53, 0x69, 0x6e, 0x74, 0x68, 0x71], // Bedroom      BF7
  [0x53, 0x69, 0x6e, 0x74, 0x68, 0x75], // Living Room  4488
  [0x53, 0x69, 0x6e, 0x74, 0x68, 0x74]  // Kitchen      FEE
];
const PACKET_UID = [
  0x03, // Service UUID length
  0x03, // Service UUID data type value
  0xaa, // 16-bit Eddystone UUID
  0xfe, // 16-bit Eddystone UUID
  0x24, // Service Data length
  0x16, // Service Data data type value
  0xaa, // 16-bit Eddystone UUID
  0xfe, // 16-bit Eddystone UUID
  0x00, // Eddystone-uid frame type
  0xf8, // txpower, use max but lower with NRF api
];
const PUCK_JS_ID = 3; // Select which instance to flash

/**
 * TLM related variable
 */
var PACKET_TLM = [
  0x02, // Length of Flags
  0x01, // Param: Flags
  0x06, // Flags 
  0x03, // Length of Service List
  0x03, // Param: Service List
  0xaa, // Eddystone
  0xfe, //   16-bit UUID
  0x11, // Length of Service Data
  0x16, // Service Data
  0xaa, // Eddystone
  0xfe, //   16-bit UUID
  0x20, // Eddystone-TLM Frame
  0x00, // Version
  0x00, // Battery voltage
  0x00, //   (zero if unknown)
  0x80, // Temperature
  0x00, //   (-128C if unknown)
  0x00, // Advertising count
  0x00, //   (number of
  0x00, //   advertisement frames
  0x00, //   since last reboot)
  0x00, // Uptime
  0x00, //   (time since
  0x00, //   last reboot with
  0x00  //   0.1s resolution)
];
/**
 * Time constants
 */
const ADVERTISING_INTERVAL_MILLIS = 2000;
const LED_BLINK_MILLIS = 200;

/** 
 * Global variables
 */
var isSleeping = false;
var mainRunner;
var advertisingCount = 0;
var uptimeMillis = 0;
var packet = [];

/**
 * Methods
 */
const updateAdvertisingPacket = () => {
  advertisingCount++;
  uptimeMillis += ADVERTISING_INTERVAL_MILLIS / 2;

  if (advertisingCount % 10 === 0) {
    updateAdvertisingPacketUid();
  } else {
    updateAdvertisingPacketTlm();
  }
};

const updateAdvertisingPacketTlm = () => {
  var batteryMillivolts = Math.round(NRF.getBattery() * 1000);
  var uptimeTenths = Math.round(uptimeMillis / 100);

  PACKET_TLM[13] = (batteryMillivolts >> 8) & 0xff;
  PACKET_TLM[14] = batteryMillivolts & 0xff;
  PACKET_TLM[15] = Math.round(E.getTemperature());
  PACKET_TLM[16] = 0x00;
  PACKET_TLM[17] = (advertisingCount >> 24) & 0xff;
  PACKET_TLM[18] = (advertisingCount >> 16) & 0xff;
  PACKET_TLM[19] = (advertisingCount >> 8) & 0xff;
  PACKET_TLM[20] = advertisingCount & 0xff;
  PACKET_TLM[21] = (uptimeTenths >> 24) & 0xff;
  PACKET_TLM[22] = (uptimeTenths >> 16) & 0xff;
  PACKET_TLM[23] = (uptimeTenths >> 8) & 0xff;
  PACKET_TLM[24] = uptimeTenths & 0xff;

  packet = PACKET_TLM;
};

const updateAdvertisingPacketUid = () => {
  var data = PACKET_UID.concat(NAMESPACE).concat(INSTANCES[PUCK_JS_ID]);
  data[4] = data.length - 5;
  packet = data;
};

const main = () => {
  advertisingCount = 0;
  uptimeMillis = 0;
  mainRunner = setInterval(() => {
    updateAdvertisingPacket();
    NRF.setAdvertising(packet, { interval: ADVERTISING_INTERVAL_MILLIS });
  }, Math.round(ADVERTISING_INTERVAL_MILLIS / 2));
};

setWatch((_) => {
  if (isSleeping) {
    LED2.write(true); // Green = wake
    setTimeout(() => {
      LED2.write(false);
      isSleeping = false;
      NRF.wake();
      main();
    }, LED_BLINK_MILLIS);
  }
  else {
    LED1.write(true); // Red = sleep
    clearInterval(mainRunner);
    setTimeout(() => {
      LED1.write(false);
      isSleeping = true;
      NRF.sleep();
    }, LED_BLINK_MILLIS);
  }
}, BTN, { edge: "rising", repeat: true, debounce: 50 });

main();
