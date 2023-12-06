import axios from 'axios';
import mysql from 'mysql2/promise';
import { Audio } from './audioModel'; // Adjust the path based on your file structure

const clientId = '5a2b306007e240398bbc29e30be37c76';
const clientSecret = '45500ceec49548a286fec89ccc7a2568';

// MySQL connection pool
const pool = mysql.createPool({
  host: '161.97.144.27',
  port: '8093',
  user: 'root',
  password: 'guessagain93',
  database: 'MetaHub'
});

async function getAccessToken() {
  // ... (unchanged)
}

async function getTrackInfo(trackId, accessToken) {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const trackInfo = response.data;

    // Create an instance of the Audio model
    const audioInstance = new Audio(trackInfo.id, JSON.stringify(trackInfo));

    // Insert into Audio table
    const connection = await pool.getConnection();
    const [audioRows] = await connection.execute('INSERT INTO Audio (audioName, audioDescription) VALUES (?, ?)', [audioInstance.audioName, audioInstance.audioDescription]);
    connection.release();

    console.log(`Track information for ${trackId} stored in the Audio table.`);
  } catch (error) {
    console.error(`Error fetching or storing track information for ${trackId}:`, error.response ? error.response.data : error.message);
  }
}

async function processTracks() {
  const accessToken = await getAccessToken();

  const trackIds = [
    'pQq9eP5OFhw',
    'tNxUxm3-658',
    'gir8BEqAutk',
    // Add other track IDs as needed
  ];

  for (const trackId of trackIds) {
    await getTrackInfo(trackId, accessToken);
  }
}

processTracks();
