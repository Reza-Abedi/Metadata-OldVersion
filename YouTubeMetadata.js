const axios = require('axios');
const mysql = require('mysql2/promise'); // Using the promise version
 
// Your API key
const apiKey = 'YOUR_API_KEY';
 
// List of video IDs for your 10 music tracks
const videoIds = ['VIDEO_ID_1', 'VIDEO_ID_2', 'VIDEO_ID_3', /* ... */];
 
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
        const [rows] = await connection.execute('INSERT INTO VideoMetadata (videoId, title, description, publishedAt) VALUES (?, ?, ?, ?)', [videoId, metadata.title, metadata.description, metadata.publishedAt]);
        connection.release();
        console.log(`Metadata for video ${videoId} stored in the database.`);
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