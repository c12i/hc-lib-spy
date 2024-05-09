#!/usr/bin/env node

import HcLibSpy from './util.mjs';

const PACKAGES = [
	'@holochain/client',
	'@holochain/tryorama',
	'@holochain/hc-spin',
	'@holo-host/web-sdk',
	'@holochain-playground/cli'
];

const releasedPackageToVersion = {};

(async () => {
	for (let p of PACKAGES) {
		const spy = new HcLibSpy(p);
		const release = await spy.checkMostRecentRelease();
		if (release) {
			releasedPackageToVersion[p] = release;
		}
	}
	const result = JSON.stringify(releasedPackageToVersion);
	if (result !== '{}') {
		console.log(JSON.stringify(releasedPackageToVersion));
	}
})();
