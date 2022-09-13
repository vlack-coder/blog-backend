var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'dscoclgbp', 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET, 
    secure: true
  });

  module.exports = cloudinary