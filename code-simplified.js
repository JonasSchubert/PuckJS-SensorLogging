setInterval(() => {
    const battery = Puck.getBatteryPercentage();
  
    if (battery < 10) {
      LED1.write(true);
    }
  
    NRF.setAdvertising({
      0x1809: [Math.round(E.getTemperature())],
      0x2A19: [battery],
      0x3232: [Number(Puck.light()) * 0x64]
    });
  }, 15000);
  