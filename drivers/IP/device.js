'use strict';

const { Device } = require('homey');
const axios = require('axios');

class IPDevice extends Device {
  
  async onInit() {
    this.log('IP Converter Device has been inited');

    this.IPconverterTrigger = this.homey.flow.getDeviceTriggerCard('new_ip_convert');

    this.getAddressAction = this.homey.flow.getActionCard('action_ip_convert');
    this.getAddressAction.registerRunListener(async (args, state) => {
      const { IP, access_key } = args; // Haal de latitude en longitude waarden uit de args
      await this.fetchAddress(IP, access_key); // Geef de waarden door aan de fetchAddress functie
      return true;
    });
  }

  triggerIPconverterTrigger(address) {
    this.IPconverterTrigger
      .trigger(this, address)
      .catch(this.error)
      .then(this.log);
  }

  async fetchAddress(IP, access_key) {
    const apiUrl = `http://api.ipstack.com/${IP}?access_key=${access_key}&format=1`;

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
      ip: apiResponse.ip,
      type: apiResponse.type,
      continent_code: apiResponse.continent_code,
      continent_name: apiResponse.continent_name,
      country_code: apiResponse.country_code,
      country_name: apiResponse.country_name,
      region_code: apiResponse.region_code,
      region_name: apiResponse.region_name,
      city: apiResponse.city,
      zip: apiResponse.zip,
      latitude: apiResponse.latitude,
      longitude: apiResponse.longitude,
      capital: apiResponse.location.capital,
      language_code: apiResponse.location.languages[0].code,
      language_name: apiResponse.location.languages[0].name,
      language_native: apiResponse.location.languages[0].native,
    };
    
    // Het activeren van de trigger met de samengestelde tokens
    this.triggerIPconverterTrigger(tokens);
    console.log(tokens);

    // Optioneel: Als je extra logica wilt toevoegen op basis van andere waarden uit de API-respons, kun je dat hier doen
  }
}

module.exports = IPDevice;
