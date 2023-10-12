const express = require('express');
const router = express.Router()
const multer = require('multer')
const path = require('path');
const cp = require('child_process');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + extension);
    },
});

let upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }
}).single('image');



router.get('/', (req, res) => {
    imageUrl = ""
    res.render('formsub.ejs')
})


router.post('/', (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            const imagePath = req.file.path;
            const newFilename = 'done-' + Date.now() + '.png';
            const outputPath = path.join('public/uploads/', newFilename);
            // const command = `rembg i ${imagePath} ${outputPath}`

            const mod = req.body.mod;
            // Initialize the command
            let command;

            // Switch the command depending on the `mod` value
            switch (mod) {
                case 'rembg':
                    command = `rembg i ${imagePath} ${outputPath}`;
                    break;
                case 'upscale':
                    command = `RembgMod2 ${imagePath} ${outputPath}`;
                    break;
                // default:
                //     command = `rembg i ${imagePath} ${outputPath}`;
            }




            new Promise((resolve, reject) => {
                cp.exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error occurred: ${error.message}`);
                        reject('Error occurred during image processing');
                    }
                    if (stderr) {
                        console.error(`stderr: ${stderr}`);
                        reject('Error occurred during image processing');
                    }
                    resolve();
                });
            })
                .then(() => {
                    const imageUrl = `http://localhost:3000/uploads/${newFilename}`;
                    res.json({ imageUrl });

                    // Delete input and processed images after sending the response
                    setTimeout(() => {
                        fs.unlink(imagePath, (err) => {
                            if (err) console.error(`Failed to delete input image: ${err}`);
                        });

                        fs.unlink(outputPath, (err) => {
                            if (err) console.error(`Failed to delete processed image: ${err}`);
                        });
                    }, 5000); // Delay as needed
                })
                .catch((error) => {
                    res.status(500).send(error);
                });
        }
    });
});
module.exports = router