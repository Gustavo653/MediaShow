const util = require('util');
const { Storage } = require('@google-cloud/storage');

const keyFilename = 'mediashow-express-bucket.json';
const storage = process.env.NODE_ENV == 'production' ? new Storage() : new Storage({ keyFilename });
const bucketName = 'mediashow-express-bucket';
const bucket = storage.bucket(bucketName);

exports.uploadImage = (file, fileName) => new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
        resumable: false
    });

    blobStream
        .on('finish', () => {
            const publicUrl = util.format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            );
            resolve(publicUrl);
        })
        .on('error', (err) => {
            console.log(err);
            reject(`Unable to upload image, something went wrong`);
        })
        .end(buffer);
});


exports.deleteImage = (fileName) => new Promise((resolve, reject) => {
    const file = bucket.file(fileName);
    file.delete((err, _) => {
        if (err) {
            console.error(err);
            reject(`Erro ao excluir o anexo ${fileName}`);
        } else {
            resolve(`Anexo ${fileName} excluído com sucesso`);
        }
    });
});

