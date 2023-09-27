'use strict';

const { Device } = require('homey');

// Dynamisch importeren van node-fetch
let fetch;
import('node-fetch').then(importedFetch => {
  fetch = importedFetch.default || importedFetch;
});

class pdfDevice extends Device {

  async onInit() {
    this.log('pdf Converter Device has been initialized');

    this.pdfconverterTrigger = this.homey.flow.getDeviceTriggerCard('new_pdf_convert');

    this.getpdfAction = this.homey.flow.getActionCard('action_pdf_convert');
    this.getpdfAction.registerRunListener(async (args, state) => {
      this.log('pdf converter action card is being run with:', args);
      const { url, apikey } = args; 
      await this.fetchpdf(url, apikey); 
      return true;
    });
  }

  triggerpdfconverterTrigger(tokens) {
    this.pdfconverterTrigger
      .trigger(this, tokens)
      .catch(this.error)
      .then(this.log);
  }

  async fetchpdf(url, apikey) {
    if (!fetch) {
      this.log('node-fetch is nog niet geïmporteerd');
      return;
    }
  
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://api.apilayer.com/url_to_pdf?url=${encodedUrl}`;
  
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
    if (!result || !result.pdf_url) {
      this.log('Ongeldige response: "pdf_url" veld ontbreekt');
      return;
    }

    const tokens = {
      pdf_url: result.pdf_url,
      requested_url: result.requested_url,
    };
    
    this.triggerpdfconverterTrigger(tokens);
    this.log(tokens);
  }
}

module.exports = pdfDevice;
