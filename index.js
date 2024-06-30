const fs = require('fs');
const cron = require('node-cron');
const fetchRSSFeeds = require('./utils/fetchData');
const { searchTopics } = require('./constant/entityConfig');
const { extractTopics, getNewsId, convertToISODate } = require('./utils/utils');
const {
	storeAllNews,
	getExistingNewsData,
	getFilteredData,
} = require('./utils/storeData');

const getExistingNewsIds = (existingNewsFeed) => {
	return new Set(existingNewsFeed.map((news) => news.feedId));
};

const getNewsTopics = async (newsContent, newsId) => {
	if (!newsContent) {
		console.log(
			`No description available for this ID ${newsId} to extract topics!`
		);
		return [];
	}
	try {
		const topics = await extractTopics(newsContent);
		return topics[0];
	} catch (error) {
		console.error('Error extracting topics:', error);
		return [];
	}
};

const parseNewsData = async () => {
	try {
		const fetchedNewsFeed = (await fetchRSSFeeds()).flat();
		const existingNewsFeed = getExistingNewsData();
		const existingNewsIds = getExistingNewsIds(existingNewsFeed);
		const newNewsFeed = [];

		for (const news of fetchedNewsFeed) {
			if (news) {
				const newsId = getNewsId(news);
				if (!existingNewsIds.has(newsId)) {
					const newsTopics = await getNewsTopics(news.content, newsId);
					newNewsFeed.push({
						feedId: newsId,
						title: news.title || 'No title available for this news!',
						description:
							news.content || 'No description available for this news!',
						pubDate: convertToISODate(news),
						link: news.link || '#',
						categories: news.categories?.map((category) => category._) || [],
						newsTopics,
					});
				}
			}
		}

		const allNews = [...existingNewsFeed, ...newNewsFeed];
		allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

		if (allNews.length) {
			storeAllNews(allNews);
		} else {
			console.log('No article parsed!!!');
		}
	} catch (error) {
		console.error('Error in processing:', error);
	}
};

// Schedule to run every hour
cron.schedule('0 * * * *', parseNewsData);

// Parse news data from RSS feed at initial run
parseNewsData();

// Filter news by topics.
// getFilteredData(searchTopics);
