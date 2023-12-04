import exifr from 'exifr';
import fs from 'fs';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '161.97.144.27',
  port: '8093',
  user: 'root',
  password: 'guessagain93',
    database: 'MetaHub'
});

async function insertMetadata(image, metadata) {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute('INSERT INTO Pictures (pictureName, pictureDescription) VALUES (?, ?)', [image, JSON.stringify(metadata)]);
    console.log(`Metadata for ${image} inserted into the database.`);
    connection.release();
  } catch (error) {
    console.error(`Error inserting metadata for ${image}: ${error.message}`);
  }
}

let images = fs.readdirSync('images');

for (let image of images) {
  if (image.slice(-4) === '.jpg') {
    console.log('IMAGE: ' + image);
    try {
      let metadata = await exifr.parse('images/' + image);
      console.log(metadata);

      await insertMetadata(image, metadata);
    } catch (error) {
      console.error(`Error processing metadata for ${image}: ${error.message}`);
    }
  }
}

pool.end();
