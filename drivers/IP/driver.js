'use strict';

const { Driver } = require('homey');

const crypto = require('crypto');

class IPDriver extends Driver {

	async onInit() {
		this.log('IP converter driver has been initialized');
	}

	async onPairListDevices() {
		const id = crypto.randomUUID();
		return [
			{
				name: `IP to address-${id}`,
				data: {
					id,
				},
			},
		];
	}

}

module.exports = IPDriver;
