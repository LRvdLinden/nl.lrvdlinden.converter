'use strict';

const { Driver } = require('homey');

const crypto = require('crypto');

class GPSconverterDriver extends Driver {

	async onInit() {
		this.log('GPS converter driver has been initialized');
	}

	async onPairListDevices() {
		const id = crypto.randomUUID();
		return [
			{
				name: `GPS Converter-${id}`,
				data: {
					id,
				},
			},
		];
	}

}

module.exports = GPSconverterDriver;
