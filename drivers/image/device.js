'use strict';

const { Device } = require('homey');

// Dynamisch importeren van node-fetch
let fetch;
import('node-fetch').then(importedFetch => {
  fetch = importedFetch.default || importedFetch;
});

class imageDevice extends Device {

  async onInit() {
    this.log('Image Converter Device has been initialized');

    this.imageconverterTrigger = this.homey.flow.getDeviceTriggerCard('new_image_convert');

    this.getImageAction = this.homey.flow.getActionCard('action_image_convert');
    this.getImageAction.registerRunListener(async (args, state) => {
      this.log('Image converter action card is being run with:', args);
      const { url, apikey } = args; 
      await this.fetchImage(url, apikey); 
      return true;
    });
  }

  triggerImageconverterTrigger(tokens) {
    this.imageconverterTrigger
      .trigger(this, tokens)
      .catch(this.error)
      .then(this.log);
  }

  async fetchImage(url, apikey) {
    if (!fetch) {
      this.log('node-fetch is nog niet geïmporteerd');
      return;
    }
  
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://api.apilayer.com/image_to_text/url?url=${encodedUrl}`;
  
    const myHeaders = new Headers();
    myHeaders.append("apikey", apikey);
  
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
  
    try {
      const response = await fetch(apiUrl, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("API Response:", result);
      this.processApiResponse(result);
    } catch (error) {
      this.log(error);
    }
  }
  

  processApiResponse(result) {
    if (!result || !result.all_text || !result.annotations) {
      this.log('Ongeldige response: "all_text" of "annotations" veld ontbreekt');
      return;
    }

    const tokens = {
      all_text: result.all_text,
      annotations: JSON.stringify(result.annotations),
    };
    
    this.triggerImageconverterTrigger(tokens);
    this.log(tokens);
  }
}

module.exports = imageDevice;
