'use strict';

const { Driver } = require('homey');

const crypto = require('crypto');

class imageDriver extends Driver {

	async onInit() {
		this.log('Image converter driver has been initialized');
	}

	async onPairListDevices() {
		const id = crypto.randomUUID();
		return [
			{
				name: `Image to location-${id}`,
				data: {
					id,
				},
			},
		];
	}

}

module.exports = imageDriver;
