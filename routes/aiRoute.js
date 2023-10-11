const express = require('express');
const router = express.Router()
const multer = require('multer')
const path = require('path');
const cp = require('child_process');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + extension);
    },
});

const upload = multer({ storage })



router.get('/', (req, res) => {
    imageUrl = ""
    res.render('formsub.ejs')
})


router.post('/', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;
    const command = `rembg i ${imagePath} public/uploads/done.png`;


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
            // Wait for 1 second for the file to completely write to the disk
            setTimeout(() => {
                const generatedImagePath = 'uploads/done.png';
                const imageUrl = `http://localhost:3000/${generatedImagePath}`;
                res.render('./formsub.ejs', { imageUrl });

            }, 1000);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

module.exports = router