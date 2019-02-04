const cloudinary = require('../config/cloudinary')

// Creating a promise to upload the image to Coudinary
const uploadFile = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
            { resource_type: 'raw'},
            (err, response) => {
                if(err) reject(err.response)
                resolve(response)
            }
        ).end(fileBuffer)
    })
}

module.exports = {
    uploadFile
}