const upload = document.querySelector('#uploadFile');
const preview = document.querySelector('#preview');
upload.onchange = function () {
    preview.src = URL.createObjectURL(upload.files[0])
}


