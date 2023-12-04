# MetaHub
 Our team, consisting of three members, undertook the task of building a metadata search engine as part of the for the Metadata course. 
# Image Metadata Extractor

This script is designed to extract metadata from JPEG images in the 'images' directory and store the information in a MySQL database.

## Prerequisites

Before running the script, ensure you have the following dependencies installed:

- Node.js: https://nodejs.org/
- exifr: https://www.npmjs.com/package/exifr
- mysql2: https://www.npmjs.com/package/mysql2

Install the dependencies using the following command:

npm install exifr mysql2

## Configuration

Update the MySQL database connection details in the script:

const pool = mysql.createPool({
  host: 'your_database_host',
  port: 'your_database_port',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name'
});

## Usage

1. Place your JPEG images in the 'images' directory.
2. Run the script using the following command:

node your_script_name.js

Replace your_script_name.js with the actual name of your script.

## Database Schema

The script assumes the existence of a MySQL database named 'MetaHub' with a table named 'Pictures'. Ensure the table has at least the following columns:

- pictureName (VARCHAR): Stores the name of the image file.
- pictureDescription (JSON): Stores the extracted metadata in JSON format.

## Error Handling

If there are any errors during metadata extraction or database insertion, error messages will be logged to the console.

## Closing the MySQL Connection Pool

The script automatically closes the MySQL connection pool at the end.


