'use strict';

const Homey = require('homey');

class homeyconverter extends Homey.App {
    log() {
        console.log.bind(this, '[log]').apply(this, arguments);
    }

    error() {
        console.error.bind(this, '[error]').apply(this, arguments);
    }

    // -------------------- INIT ----------------------

    async onInit() {
        this.log(`${this.homey.manifest.id} - ${this.homey.manifest.version} started...`);
    }

}

// module.exports.init = homeyconverter;
module.exports = homeyconverter;