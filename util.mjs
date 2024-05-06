import https from 'node:https'

function offsetNHours(n) {
	return new Date(new Date().getTime() - (n * 60 * 60 * 1000));
}

class HcLibSpy {
	constructor(_package) {
		this.package = _package;
	}

	async checkMostRecentRelease(time = 6) {
		const offsetN = offsetNHours(time);
		const result = await this._fetchPackageDetails(144);
		if (!(result && 'time' in result)) {
			throw new Error('Failed to check most recent release: Invalid response body');
		}
		const releasesAndTimestamp = Object.entries(result.time);
		const mostRecentRelease = releasesAndTimestamp
			.filter(([_, timestamp]) => new Date(timestamp) >= offsetN)
			.filter(([version]) => !['created', 'modified'].includes(version))
			.sort(([_, timestampA], [__, timestampB]) => new Date(timestampB) - new Date(timestampA))
			.map(([version]) => version)
		if (!mostRecentRelease.length) {
			return;
		}
		return mostRecentRelease[0]
	}

	_fetchPackageDetails() {
		const URL = `https://registry.npmjs.org/${this.package}`;
		const request = {
			headers: {'User-Agent': 'hc-lib-spy'}
		};
		return new Promise((resolve, reject) => {
			https.get(URL, request, (res) => {
				let data = '';
				res.on('data', (chunk) => {
					data += chunk;
				});
				res.on('end', () => {
					try {
						resolve(JSON.parse(data))
					} catch (e) {
						console.error('Error processing result', e);
						resolve(e);
					}
				});
			}).on('error', (e) => {
				console.error(`Got error: ${e.message}`);
				resolve(e);
			});
		});
	}
}

export default HcLibSpy;