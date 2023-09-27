'use strict';

const { Driver } = require('homey');

const crypto = require('crypto');

class numberDriver extends Driver {

	async onInit() {
		this.log('Number converter driver has been initialized');
	}

	async onPairListDevices() {
		const id = crypto.randomUUID();
		return [
			{
				name: `Number to location-${id}`,
				data: {
					id,
				},
			},
		];
	}

}

module.exports = numberDriver;
