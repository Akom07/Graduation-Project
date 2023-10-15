const upload = document.querySelector('#uploadFile');
const preview = document.querySelector('#preview');
upload.onchange = function () {
    preview.src = URL.createObjectURL(upload.files[0]);
};
window.addEventListener('load', function () {
    document.getElementById('downloadButton').addEventListener('click', function (e) {
        e.preventDefault();
        let imageUrl = document.getElementById('preview').src;
        let downloadLink = document.getElementById('downloadLink');
        downloadLink.href = imageUrl;
        downloadLink.download = 'SmartPic';
        downloadLink.click();
    });
});

// Select the form element
const form = document.querySelector('form');

// Add an event listener for form submission
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Show the loader
    const overlay = document.querySelector('.overlay');
    overlay.style.display = 'flex';

    // Create a FormData object
    let formData = new FormData();

    // Append the selected image file
    let fileInput = document.querySelector('input[type=file]');
    let file = fileInput.files[0];
    formData.append('image', file);

    // Get the value of the selected radio button
    let mod = document.querySelector('input[name=mod]:checked').value;
    formData.append('mod', mod);

    // Axios POST request
    axios
        .post('/formsub', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(function (response) {
            // Hide the loader
            overlay.style.display = 'none';
            preview.src = response.data.imageUrl;
        })
        .catch(function (error) {
            // If there's an error, log it and hide the loader
            console.error(error);
            overlay.style.display = 'none';
        });
});