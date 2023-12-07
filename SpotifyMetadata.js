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

    const albumInfo = trackInfo.album;
    const artistInfo = trackInfo.artists[0]; // Assuming there is only one artist for simplicity

    // Insert into Audio table with specific information
    const connection = await pool.getConnection();
    console.log('Connected to the database');

    const [audioRows] = await connection.execute(
      'INSERT INTO Audio (audioName, audioDescription) VALUES (?, ?)',
      [
        trackInfo.name,  // Use track name as audioName
        JSON.stringify({
          album: {
            name: albumInfo.name,
            release_date: albumInfo.release_date,
            total_tracks: albumInfo.total_tracks,
            spotify_url: albumInfo.external_urls.spotify,
          },
          artist: {
            name: artistInfo.name,
            spotify_url: artistInfo.external_urls.spotify,
          },
          track: {
            name: trackInfo.name,
            track_number: trackInfo.track_number,
            duration_ms: trackInfo.duration_ms,
            explicit: trackInfo.explicit,
            popularity: trackInfo.popularity,
            isrc: trackInfo.external_ids.isrc,
            spotify_url: trackInfo.external_urls.spotify,
          },
        }),
      ]
    );

    console.log(`Track information for ${trackId} stored in the Audio table.`);
    connection.release();
    console.log('Connection released');
  } catch (error) {
    console.error(`Error fetching or storing track information for ${trackId}:`, error.response ? error.response.data : error.message);
  }
}

// Replace '1hR8BSuEqPCCZfv93zzzz9' with your actual track IDs
const trackIds = ['1hR8BSuEqPCCZfv93zzzz9'];

async function processTracks() {
  const accessToken = await getAccessToken();

  for (const trackId of trackIds) {
    await getTrackInfo(trackId, accessToken);
  }
}

processTracks();
