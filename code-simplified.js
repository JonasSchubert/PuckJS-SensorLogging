setInterval(() => {
  const battery = Puck.getBatteryPercentage();

  if (battery < 10) {
    LED1.write(true);
  } else {
    LED1.write(false);
  }

  NRF.setAdvertising({
    0x1809: [Math.round(E.getTemperature())],
    0x2A19: [battery],
    0x3232: [Number(Puck.light()) * 0x64]
  });
}, 30000);
