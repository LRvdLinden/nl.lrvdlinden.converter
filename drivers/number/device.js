'use strict';

const { Device } = require('homey');

let fetch;
import('node-fetch').then(module => {
  fetch = module.default;
});

class numberDevice extends Device {
  
  async onInit() {
    this.log('Number Converter Device has been initialized');

    this.numberconverterTrigger = this.homey.flow.getDeviceTriggerCard('new_number_convert');

    this.getNumberAction = this.homey.flow.getActionCard('action_number_convert');
    this.getNumberAction.registerRunListener(async (args, state) => {
      const { number, apikey } = args; 
      await this.fetchNumber(number, apikey); 
      return true;
    });
  }

  triggerNumberconverterTrigger(tokens) {
    this.numberconverterTrigger
      .trigger(this, tokens)
      .catch(this.error)
      .then(this.log);
  }

  async fetchNumber(number, apikey) {
    const myHeaders = new Headers();
    myHeaders.append("apikey", apikey);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    try {
      const response = await fetch(`https://api.apilayer.com/number_verification/validate?number=${encodeURIComponent(number)}`, requestOptions);
      const result = await response.json(); 
      this.processApiResponse(result);
    } catch (error) {
      this.log(error);
    }
  }

  processApiResponse(result) {
    const tokens = {
      number: result.number,
      local_format: result.local_format,
      international_format: result.international_format,
      country_prefix: result.country_prefix,
      country_code: result.country_code,
      country_name: result.country_name,
      location: result.location,
      carrier: result.carrier,
      line_type: result.line_type,
    };
    
    this.triggerNumberconverterTrigger(tokens);
    this.log(tokens);
  }
}

module.exports = numberDevice;
