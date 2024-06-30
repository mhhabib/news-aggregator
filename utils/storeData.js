const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'db', 'newsData.json');
const filterdataPath = path.join(__dirname, '..', 'db', 'filteredData.json');

// Stores new news data
const storeAllNews = (newsData) => {
	const data = JSON.stringify(newsData, null, 2);
	fs.writeFileSync(dataPath, data, 'utf8');
	console.log(
		`News aggregation data updated successfully! Go and check out the ${dataPath} file`
	);
};

// Get existing news data to avoid potential data duplication
const getExistingNewsData = () => {
	try {
		if (!fs.existsSync(dataPath)) {
			fs.writeFileSync(dataPath, '[]', 'utf8');
		}

		const newsData = fs.readFileSync(dataPath, 'utf8');
		return newsData ? JSON.parse(newsData) : [];
	} catch (error) {
		console.error('Error reading existing data:', error);
		return [];
	}
};

// Get filter data ensures topics based news
const getFilteredData = (key) => {
	let newsData = [];
	try {
		const data = fs.readFileSync(dataPath, 'utf8');
		newsData = data ? JSON.parse(data) : [];
	} catch (error) {
		console.error('Error reading existing data:', error);
		return;
	}
	if (newsData.length > 0) {
		const filteredData = newsData.filter((item) => {
			return item.newsTopics.some((topic) => topic.topicsType === key);
		});
		fs.writeFileSync(
			filterdataPath,
			JSON.stringify(filteredData, null, 2),
			'utf8'
		);
		console.log(
			`News filtering is successful for this Key: ${key} . Please Go and check out the ${filterdataPath} file`
		);
	} else {
		console.log(`No news data is found for this Key: ${key}`);
	}
};

module.exports = {
	storeAllNews,
	getExistingNewsData,
	getFilteredData,
};
