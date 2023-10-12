const upload = document.querySelector('#uploadFile');
const preview = document.querySelector('#preview');
upload.onchange = function () {
    preview.src = URL.createObjectURL(upload.files[0])
}
// Select the form element
const form = document.querySelector('form');

// Add an event listener for form submission 
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Show the loader
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    // Create a FormData object and append the image file
    let formData = new FormData();
    let fileInput = document.querySelector('input[type=file]');
    let file = fileInput.files[0];

    formData.append('image', file);

    // Axios POST request
    axios.post('/formsub', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(function (response) {
            // Hide the loader
            loader.style.display = 'none';
            preview.src = response.data.imageUrl;
        })
        .catch(function (error) {
            // If there's an error, log it and hide the loader
            console.error(error);
            loader.style.display = 'none';
        });
});