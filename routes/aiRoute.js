const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cp = require('child_process');
const fs = require('fs');
const async = require('async');

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

let uploadQueue = async.queue((task, done) => {
    upload(task.req, task.res, (err) => {
        if (err) {
            task.res.status(500).send(err);
        } else {
            const imagePath = task.req.file.path;
            const newFilename = 'done-' + Date.now() + '.png';
            const outputPath = path.join('public/uploads/', newFilename);

            let command;
            switch (task.req.body.mod) {
                case 'rembg':
                    command = `rembg i ${imagePath} ${outputPath}`;
                    break;
                case 'scale':
                    command = `realesrgan/realesrgan-ncnn-vulkan.exe -i ${imagePath} -o ${outputPath} -g0`;
                    break;
            }

            new Promise((resolve, reject) => {
                cp.exec(command, (error, stdout, stderr) => {
                    if (error || stderr) {
                        console.error(`Error occurred: ${error?.message || stderr}`);
                        reject('Error occurred during image processing');
                    }
                    resolve();
                });
            })
                .then(() => {
                    const imageUrl = `http://localhost:3000/uploads/${newFilename}`;
                    task.res.json({ imageUrl });

                    setTimeout(() => {
                        fs.unlink(imagePath, (err) => {
                            if (err) console.error(`Failed to delete input image: ${err}`);
                        });

                        fs.unlink(outputPath, (err) => {
                            if (err) console.error(`Failed to delete processed image: ${err}`);
                        });
                    }, 5000);

                    done();
                })
                .catch((error) => {
                    task.res.status(500).send(error);
                });
        }
    });
}, 1);  // concurrency level is set to 1

router.get('/', (req, res) => {
    imageUrl = ""
    res.render('formsub.ejs')
})

router.post('/', (req, res) => {
    uploadQueue.push({ req, res });
});

module.exports = router;
