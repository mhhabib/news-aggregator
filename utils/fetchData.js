const axios = require('axios');
const RSSParser = require('rss-parser');
const { rssFeeds } = require('../constant/configRSSUrl');
const { validateUrl } = require('./utils');
const rssParser = new RSSParser();

const fetchRSSFeed = async (url, retries = 5, delay = 1000) => {
	if (!validateUrl(url)) {
		console.error(`Invalid URL: ${url}`);
		return null;
	}

	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const response = await axios.get(url, { timeout: 5000 });
			if (response.status !== 200) {
				throw new Error(`HTTP Status ${response.status}`);
			}
			const result = await rssParser.parseString(response.data);
			return result.items;
		} catch (error) {
			if (attempt === retries) {
				console.error(
					`Error fetching the RSS feed from ${url} after ${retries} attempts:`,
					error.message
				);
				return null;
			}
			console.warn(
				`Attempt ${attempt} to fetch RSS feed from ${url} failed: ${error.message}. Retrying in ${delay}ms...`
			);
			await new Promise((resolve) => setTimeout(resolve, delay));
			delay *= 2;
		}
	}
};

const fetchRSSFeeds = async () => {
	const feedPromises = rssFeeds.map((url) => fetchRSSFeed(url));
	return Promise.all(feedPromises);
};

module.exports = fetchRSSFeeds;
