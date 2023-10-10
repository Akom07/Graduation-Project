const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer')
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home.ejs')
})
app.get('/formsub', (req, res) => {
    imageUrl = ""
    res.render('formsub.ejs')
})


app.post('/formsub', upload.single('image'), async (req, res) => {
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
                res.render('formsub.ejs', { imageUrl });
            }, 1000);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});


app.listen(3000, () => {

    console.log("we are on port 3000")
})