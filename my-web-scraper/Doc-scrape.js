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
    host: '...',
    user: '',
    password: '',
    database: ''
  });

  const [rows, fields] = await connection.execute(
    'INSERT INTO Documents (documentName, documentDescription) VALUES (?, ?)',
    [metadata.title, JSON.stringify(metadata)]
  );

  console.log('Inserted into database:', rows);

  await connection.end();
}


scrapeWebsite('https://www.google.se/books/edition/Scalable_Data_Streaming_with_Amazon_Kine/GekmEAAAQBAJ?hl=sv&gbpv=1');
