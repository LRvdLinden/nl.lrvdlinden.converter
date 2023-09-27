'use strict';

const { Device } = require('homey');
const axios = require('axios');

class GPSconverterDevice extends Device {
  
  async onInit() {
    this.log('GPS Converter Device has been inited');

    this.GPSconverterTrigger = this.homey.flow.getDeviceTriggerCard('new_gps_convert');

    this.getAddressAction = this.homey.flow.getActionCard('action_gps_convert');
    this.getAddressAction.registerRunListener(async (args, state) => {
      const { latitude, longitude } = args; // Haal de latitude en longitude waarden uit de args
      await this.fetchAddress(latitude, longitude); // Geef de waarden door aan de fetchAddress functie
      return true;
    });
  }

  triggerGPSconverterTrigger(address) {
    this.GPSconverterTrigger
      .trigger(this, address)
      .catch(this.error)
      .then(this.log);
  }

  async fetchAddress(latitude, longitude) {
    const apiUrl = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;

    try {
      const response = await axios.get(apiUrl);
      const apiResponse = response.data;
      this.processApiResponse(apiResponse);
    } catch (error) {
      this.log(error);
    }
  }

  processApiResponse(apiResponse) {
    // Ik ga ervan uit dat 'apiResponse' een object is met een 'address' eigenschap. Pas dit aan op basis van de werkelijke responsstructuur.
    const address = apiResponse.address;
    
    // Creëer het tokens object met de verkregen waarden uit de 'address'
    const tokens = {
      house_number: address.house_number ?? '',
      road: address.road ?? '',
      residential: address.residential ?? '',
      suburb: address.suburb ?? '',
      city: address.city ?? '',
      municipality: address.municipality ?? '',
      state: address.state ?? '',
      country: address.country ?? '',
      postcode: address.postcode ?? '',
      country_code: address.country_code ?? '',
    };
    
    // Het activeren van de trigger met de samengestelde tokens
    this.triggerGPSconverterTrigger(tokens);
    console.log(tokens);

    // Optioneel: Als je extra logica wilt toevoegen op basis van andere waarden uit de API-respons, kun je dat hier doen
  }
}

module.exports = GPSconverterDevice;
