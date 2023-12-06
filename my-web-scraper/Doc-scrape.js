// scrape-and-save.js

import puppeteer from 'puppeteer';
import mysql from 'mysql2/promise';

async function scrapeWebsite(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Extract metadata
  const metadata = {
    title: await page.title(),
    description: await page.$eval('meta[name=description]', (meta) => meta.content),
    // Add more properties as needed
  };

  console.log(metadata);

  // Save to MySQL database
  await saveToDatabase(metadata);

  // Close the browser
  await browser.close();
}

async function saveToDatabase(metadata) {
  const connection = await mysql.createConnection({
    host: '161.97.144.27',
    port: '8093',
    user: 'root',
    password: 'guessagain93',
    database: 'MetaHub'
  });

  const [rows, fields] = await connection.execute(
    'INSERT INTO Documents (documentName, documentDescription) VALUES (?, ?)',
    [metadata.title, JSON.stringify(metadata)]
  );

  console.log('Inserted into database:', rows);

  await connection.end();
}

// Replace 'your_database_host', 'your_database_user', 'your_database_password', and 'your_database_name' with your actual database credentials
scrapeWebsite('https://thegoodocs.com/all-templates/popular/');
