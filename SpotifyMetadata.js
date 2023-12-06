import axios from 'axios';
import mysql from 'mysql2/promise';

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
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    }
  );

  return response.data.access_token;
}

async function getTrackInfo(trackId, accessToken) {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const trackInfo = response.data;
    console.log(`Track Information for ${trackId}:`, trackInfo);

    // Insert into Audio table
    const connection = await pool.getConnection();
    const [audioRows] = await connection.execute('INSERT INTO Audio (audioName, audioDescription) VALUES (?, ?)', [trackInfo.id, JSON.stringify(trackInfo)]);
    connection.release();

    console.log(`Track information for ${trackId} stored in the Audio table.`);
  } catch (error) {
    console.error(`Error fetching or storing track information for ${trackId}:`, error.response ? error.response.data : error.message);
  }
}

async function processTracks() {
  const accessToken = await getAccessToken();

const trackIds = [
  '1hR8BSuEqPCCZfv93zzzz9', // Replace with the correct track ID
  // Add other valid track IDs as needed
];


  for (const trackId of trackIds) {
    await getTrackInfo(trackId, accessToken);
  }
}

processTracks();
