'use strict';

const { Driver } = require('homey');

const crypto = require('crypto');

class pdfDriver extends Driver {

	async onInit() {
		this.log('pdf converter driver has been initialized');
	}

	async onPairListDevices() {
		const id = crypto.randomUUID();
		return [
			{
				name: `Website to pdf-${id}`,
				data: {
					id,
				},
			},
		];
	}

}

module.exports = pdfDriver;
