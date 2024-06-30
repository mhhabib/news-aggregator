# News Aggregator

The News Aggregator is a Javascript program that aggregates news articles from various RSS feeds, extracts topics from the content, and stores the data in JSON format.

## Features

- Fetches news articles from configured RSS feed URLs.
- Stores fetched articles in JSON format.
- Extracts topics from article content using AWS Comprehend.
- Filters articles based on keywords.
- Schedules periodic fetching and processing of articles.

## Project Tree

```bash
News Aggregator
├── constant
│   ├── configRSSUrl.js
│   └── namedEntities.js
├── db
│   ├── newsData.json
│   └── filteredData.json
├── utils
│   ├── fetchData.js
│   ├── storeData.js
│   └── utils.js
├── .gitignore
├── index.js
├── package.json
└── package.lock.json
```

## Prerequisites

- [AWS account](https://console.aws.amazon.com/) (for AWS Comprehend)
- Get help to access AWS keys [How to create AWS access key id & secret key](https://www.youtube.com/watch?v=fwtmTMf53Ek)
- `Requires credit card information*`

## Setup

- Clone the repository.
- Run `npm install` to install dependencies.
- Create a `.env` file with the following variables:
  - `ACCESS_KEY_ID `= your_aws_access_key_id
  - `SECRET_ACCESS_KEY `= your_aws_secret_access_key
- Run `npm start` to start the application.

## Approach

- **Data Fetching:** Uses `axios` to fetch RSS feeds and `rss-parser` to parse them.
- **Data Storage:** Stores news articles in JSON files, ensuring no duplication while fetching RSS feeds again.
  - Ensured news title, description, publication date, source link, categories, and news topics.
  - Ensured every news unique ID to avoid data duplication.
  - Ensured every news publication date for future filtering.
- **Topic Extraction:** Uses AWS Comprehend to extract news topics from news content.
  - Requires [AWS account](https://console.aws.amazon.com/) for keys and [@aws-sdk/client-comprehend](https://www.npmjs.com/package/@aws-sdk/client-comprehend) package.
  - Support `English` news for extracting the news topics.
  - Used `ComprehendClient` and `BatchDetectEntitiesCommand` for extracting topics from news.
  - Stores the extracted topics along with the corresponding news article data.
- **Error Handling:** Implements retry logic with exponential backoff for fetching RSS feeds. Additionally ensured URL validations.

## Additional Functionalities

- Filters news articles based on topics.
- Identifies and stores named entities `(PERSON, LOCATION, ORGANIZATION)` in the news article.
- Configurable scheduling to periodically fetch and process new news using `node-cron`.
