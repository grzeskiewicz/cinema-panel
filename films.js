import { API_URL, request } from './apiConnection.js';
import { validateForm } from './scripts.js';

const filmCreate = document.querySelector('#film-create');
const filmsDiv = document.querySelector('#films');
const filmSelector = document.querySelector('#film-select');


function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}


function editFilm(film) {
    return fetch(request(API_URL + "editfilm", 'POST', film))
        .then(res => res.json())
        .then(result => {
            console.log(result);
        });
}

const deleteFilm = function (id) {
    const film = { filmid: id };
    fetch(request(API_URL + "deletefilm", 'POST', film))
        .then(res => res.json())
        .then(result => {
            console.log(result);
            const filmEdit = document.getElementById('film-edit');
            if (filmEdit) filmEdit.remove();
        });

}

function uploadImage(file) {
    const formData = new FormData();
    formData.append('myImage', file);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };

    return axios.post(`${API_URL}upload-img`, formData, config)
        .then((response) => {
            return response;
        }).catch((error) => {
        });
}

function newfilm(film) {
    fetch(request(`${API_URL}newfilm`, 'POST', film))
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                setTimeout(function () {
                    filmCreate.querySelector('button').disabled = false;
                    filmCreate.reset();
                    refreshFilms();
                    alert("Film created!");
                }, 1000);
            } else {
                alert("Wrong values!");
                filmCreate.querySelector('button').disabled = false;
            }
        }).catch(error => Promise.reject(new Error(error)));
}


function refreshFilms() {
    filmsDiv.querySelector('tbody').innerHTML = "";
    fetch(request(API_URL + "films", 'GET'))
        .then(res => res.json())
        .then(films => {
            filmSelector.innerHTML = "";
            for (const film of films) {
                const option = document.createElement("option");
                option.value = film.id;
                option.text = `ID: ${film.id} || Title: ${film.title} || Director: ${film.director} || Genre: ${film.genre} || Length: ${film.length}`;
                filmSelector.options.add(option);
            }


            for (const film of films) {
                const description = document.createElement("tr");
                const modifyDiv = document.createElement("td");
                modifyDiv.dataset.id = film.id;
                modifyDiv.innerHTML = `<i class="fa fa-edit"></i>`;
              //  modifyDiv.classList.add('modify');
                const deleteDiv = document.createElement('td');
                deleteDiv.innerHTML = `<i class="fa fa-trash"></i>`;
                description.innerHTML = `<td>${film.id}</td><td>${film.title}</td><td>${film.director}</td><td>${film.genre}</td><td>${film.length}</td><td>${film.category}</td>`;
                description.appendChild(modifyDiv);
                description.appendChild(deleteDiv);
                filmsDiv.querySelector('tbody').appendChild(description);
                //filmsDiv.appendChild(descriptionDiv);

                deleteDiv.addEventListener('click', function () {
                    if (confirm("Are you sure you want to delete this film? All the purchased tickets for this showings will be REMOVED!")) {
                        deleteFilm(modifyDiv.dataset.id);
                        filmsDiv.querySelector('tbody').removeChild(description);
                    } else { }
                });

                modifyDiv.addEventListener('click', function (e) {
                    e.preventDefault();
                    const filmEdit = document.getElementById('film-edit');
                    if (filmEdit) filmEdit.remove();
                    const imageUploadDiv = document.createElement('div');
                    imageUploadDiv.id = "imageUploadDiv";
                    const filmEditForm = filmCreate.cloneNode(true);
                    filmEditForm.id = "film-edit";
                    filmEditForm.myImage.remove();
                    filmEditForm.uploadPreview.remove();
                    filmEditForm.querySelector('button').textContent = "Edit film";

                    const posterUploadEdit = document.createElement('input');
                    posterUploadEdit.type = 'file';
                    posterUploadEdit.id = "poster-edit-upload";
                    posterUploadEdit.name = 'poster-edit-upload';
                    const poster = document.createElement("img");
                    const preview = document.createElement("img");
                    preview.id = "uploadEditPreview";


                    if (window.FileReader) {
                        var reader = new FileReader(), rFilter = /^(image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i;

                        reader.onload = function (oFREvent) {
                            preview.src = oFREvent.target.result;
                            preview.style.display = "block";
                        };

                        posterUploadEdit.addEventListener('change', () => {
                            if (posterUploadEdit.files.length === 0) { return; }
                            var file = posterUploadEdit.files[0];
                            if (!rFilter.test(file.type)) { alert("You must select a valid image file!"); return; }
                            reader.readAsDataURL(file);
                        });

                    } else {
                        alert("FileReader object not found :( \nTry using Chrome, Firefox or WebKit");
                    }


                    imageUploadDiv.append(poster);
                    imageUploadDiv.append(preview);

                    filmEditForm.insertBefore(imageUploadDiv, filmEditForm.querySelector('button'));
                    filmEditForm.insertBefore(posterUploadEdit, filmEditForm.querySelector('button'));
                    const imagePreview = document.getElementById('uploadEditPreview');

                    if (imagePreview) imagePreview.src = "";

                    filmEditForm.title.value = film.title;
                    filmEditForm.director.value = film.director;
                    filmEditForm.genre.value = film.genre;
                    filmEditForm.length.value = film.length;
                    filmEditForm.category.value = film.category;

                    const filmEditWrapper = document.getElementById('film-edit-wrapper');
                    filmEditWrapper.append(filmEditForm);

                    if (film.imageUrl) poster.src = API_URL + film.imageUrl;
                    poster.alt = "Poster";
                    poster.className = "poster";


                    filmEditForm.addEventListener('submit', function (e) {
                        e.preventDefault();
                        const filmEdit = {
                            id: film.id,
                            title: filmEditForm.title.value,
                            director: filmEditForm.director.value,
                            genre: filmEditForm.genre.value,
                            length: filmEditForm.length.value,
                            category: filmEditForm.category.value,
                        };
                        if (!validateForm(filmEdit)) {
                            alert("No empty values in form please!");
                            return;
                        }

                        const files = posterUploadEdit.files;
                        if (files[0]) {
                            uploadImage(files[0]).then(result => {
                                filmEdit.imageUrl = result.data.message;
                                poster.src = API_URL + filmEdit.imageUrl;
                                editFilm(filmEdit).then(res => {
                                    refreshFilms();
                                });
                            });
                        } else {
                            filmEdit.imageUrl = film.imageUrl;
                            editFilm(filmEdit).then(res => {
                                refreshFilms();
                            });
                        }
                    });
                });

            }

        });

}

if (window.FileReader) {
    var reader = new FileReader(), rFilter = /^(image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i;

    reader.onload = function (oFREvent) {
        const preview = document.getElementById("uploadPreview")
        preview.src = oFREvent.target.result;
        preview.style.display = "block";
    };

    const fileInput = document.querySelector('#file-input');

    fileInput.addEventListener('change', (e) => {
        e.preventDefault();
        if (fileInput.files.length === 0) { return; }
        var file = fileInput.files[0];
        if (!rFilter.test(file.type)) { alert("You must select a valid image file!"); return; }
        reader.readAsDataURL(file);
    });

} else {
    alert("FileReader object not found :( \nTry using Chrome, Firefox or WebKit");
}






filmCreate.addEventListener('submit', function (e) {
    e.preventDefault();
    filmCreate.querySelector('button').disabled = true;
    const film = {
        title: filmCreate.title.value,
        director: filmCreate.director.value,
        genre: filmCreate.genre.value,
        length: filmCreate.length.value,
        category: filmCreate.category.value,
    };

    if (!validateForm(film)) {
        alert("No empty values in form please!");
        return;
    }
    film.imageUrl = '';//can be empty


    const files = document.getElementById('file-input').files;
    const file = files[0];
    if (file) {
        uploadImage(file).then(result => {
            film.imageUrl = result.data.message;
            newfilm(film);
        });
    } else {
        newfilm(film);
    }
});


export { refreshFilms, newfilm }