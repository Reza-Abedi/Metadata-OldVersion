# MetaHub
 Our team, consisting of three members, undertook the task of building a metadata search engine as part of the for the Metadata course. 



# Code Breakdown extract-metadata-images:
## Importing Modules:

exifr: A library for extracting EXIF data from image files.
fs: The Node.js file system module for working with file operations.
mysql: The MySQL database driver for Node.js.
Setting Up MySQL Connection Pool:

Creates a MySQL connection pool using the mysql2/promise library.
The pool is configured with connection details such as host, port, user, password, and database.

## Database Connection Function:

Defines an asynchronous function insertMetadata to insert image metadata into the database.
It uses a connection from the pool, performs an insertion query, and logs the result.
In case of an error, it logs an error message.

## Reading Image Files:
Reads the contents of the "images" directory synchronously using fs.readdirSync.
Filters only files with a ".jpg" extension.

## Processing Each Image:

Iterates over the list of images.
For each image with a ".jpg" extension:
Prints the image filename.
Attempts to parse the image metadata using exifr.parse.
Calls the insertMetadata function to insert the metadata into the database.
Logs any errors that occur during the metadata processing.

## Closing Database Connection Pool:

Ends the MySQL connection pool after processing all images.

## Issues/Considerations:
The code assumes all images in the "images" directory are JPEG files.
Error handling is present but might benefit from more detailed logging.
It's important to secure sensitive information such as database credentials.
