#!/usr/bin/env node

import HcLibSpy from './util.mjs';

const PACKAGES = [
	'@holochain/client',
	'@holochain/tryorama',
	'@holochain/hc-spin',
	'@holo-host/web-sdk'
];

const releasedPackageToVersion = {};

function formatMapping(map) {
	let formattedString = '';
	for (let [key, value] of Object.entries(map)) {
			formattedString += `${key}: ${value}\n`;
	}
	return formattedString.trim();
}

;(async () => {
	for (let p of PACKAGES) {
		const spy = new HcLibSpy(p);
		const release = await spy.checkMostRecentRelease(144);
		if (release) {
			releasedPackageToVersion[p] = release; 
		}
	}
	console.log(formatMapping(releasedPackageToVersion));
})();
