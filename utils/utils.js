const crypto = require('crypto');
// require('dotenv').config();
const {
	ComprehendClient,
	BatchDetectEntitiesCommand,
} = require('@aws-sdk/client-comprehend');
const { namedEntities } = require('../constant/entityConfig');

const validateUrl = (url) => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};
const isValidEntities = (entity) => {
	return [...namedEntities].includes(entity);
};
const getNewsId = (feed) => {
	return (
		feed.uuid ||
		feed.id ||
		crypto.createHash('md5').update(feed.title).digest('hex')
	);
};

const convertToISODate = (feed) => {
	let date = feed.pubDate || feed.isoDate;
	if (!date) {
		date = new Date().toISOString();
	}
	return new Date(date).toISOString();
};

const client = new ComprehendClient({
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
	},
});

const extractTopics = async (text) => {
	const params = {
		LanguageCode: 'en',
		TextList: [text],
	};

	const command = new BatchDetectEntitiesCommand(params);
	try {
		const data = await client.send(command);
		return data.ResultList.map((result) => {
			const entities = result.Entities.filter(
				(entityName) => !validateUrl(entityName.Text)
			)
				.filter((entityName) => isValidEntities(entityName.Type))
				.map((entityName) => ({
					topicsName: entityName.Text,
					topicsType: entityName.Type,
				}));
			return entities;
		});
	} catch (error) {
		console.error(error);
		return [];
	}
};

module.exports = {
	validateUrl,
	getNewsId,
	convertToISODate,
	extractTopics,
};
