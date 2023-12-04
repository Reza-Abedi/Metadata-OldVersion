// import exifr - a metadata extractor for images
import exifr from 'exifr';
// import fs (file system) - a built in module in Node.js
import fs from 'fs';

// give me a list of all files in the image folder
let images = fs.readdirSync('Materials\JPG');

// Loop through the images and extract the metadata
for (let image of images) {
  // Only for files ending with .jpg
  // slice(-4) get the last 4 letters from the image name
  if (image.slice(-4) == '.jpg') {
    console.log('IMAGE: ' + image);
    let metadata = await exifr.parse('Materials\JPG' + image);
    console.log(metadata);
  }
}
