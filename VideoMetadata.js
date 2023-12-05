const axios = require('axios');
const mysql = require('mysql2/promise');

// Your YouTube Data API key
const apiKey = 'AIzaSyASj1kyAFcuj9pGYWYVL3gZPE3btdEwKWU';

// List of specific video IDs
const videoIds = [
  'pQq9eP5OFhw',
  'tNxUxm3-658',
  'gir8BEqAutk'
];

// MySQL connection pool
const pool = mysql.createPool({
  host: '161.97.144.27',
  port: '8093',
  user: 'root',
  password: 'guessagain93',
  database: 'MetaHub'
});

async function getVideoMetadata(videoId) {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`);
    const videoMetadata = response.data.items[0].snippet;
    return videoMetadata;
  } catch (error) {
    console.error(`Failed to retrieve metadata for video ${videoId}`);
    return null;
  }
}

async function storeMetadataInDatabase(videoId, metadata) {
  try {
    const connection = await pool.getConnection();

    // Insert into Audio table
    const [audioRows] = await connection.execute('INSERT INTO Audio (audioName, audioDescription) VALUES (?, ?)', [videoId, JSON.stringify(metadata)]);

    connection.release();
    
    console.log(`Metadata for video ${videoId} stored in the Audio table.`);
  } catch (error) {
    console.error(`Failed to store metadata for video ${videoId} in the database. Error:`, error);
  }
}

// Iterate through each video ID
videoIds.forEach(async (videoId) => {
  const metadata = await getVideoMetadata(videoId);

  if (metadata) {
    await storeMetadataInDatabase(videoId, metadata);
  }
});
