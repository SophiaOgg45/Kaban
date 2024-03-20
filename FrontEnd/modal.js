document.addEventListener("DOMContentLoaded", function () {
    const modifierButton = document.querySelector('.modifier');
    const modal = document.querySelector('.modal');
    const modalGallery = document.querySelector('.modal-deleted');
    const closeButton = modal.querySelector('.close');
    const addPhotoButton = document.querySelector('.add-photo');
    const addModal = document.querySelector('.modal-add');
    const returnButton = document.querySelector('.return');
    const galleryList = document.querySelector('.gallery-list');
    const categorieSelect = document.getElementById('categorie-photo');
    const closeButtonAddModal = document.querySelector('.close-add');


    modifierButton.addEventListener('click', function () {
        modal.style.display = 'flex';
        addModal.style.display = 'none';
        modalGallery.style.display = 'flex';
    });

    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    closeButtonAddModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    function displayAddModal() {
        addPhotoButton.addEventListener('click', function () {
            addModal.style.display = 'flex';
            modalGallery.style.display = 'none';
        });
    }

    displayAddModal();

    returnButton.addEventListener('click', function () {
        addModal.style.display = 'none';
        modalGallery.style.display = 'flex';
    });

    function deleteWork(workId) {
        const token = sessionStorage.getItem('Token');

        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut : ${response.status}`);
                }
                updateGalleryInModal();
                updateGalleryOnMainPage();
            })
            .catch(error => {
                console.error('Erreur lors de la suppression du travail :', error);
            });
    }

    function updateGalleryInModal() {
        const modalGallery = document.querySelector('.gallery-list');
        fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(data => {
                modalGallery.innerHTML = "";
                data.forEach(work => {
                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    const trashIcon = document.createElement("i");

                    img.src = work.imageUrl;
                    img.alt = work.title;

                    trashIcon.classList.add('fa', 'fa-trash-alt');

                    figure.appendChild(img);
                    figure.appendChild(trashIcon);
                    figure.dataset.workId = work.id;
                    modalGallery.appendChild(figure);
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données :', error);
            });
    }

    function updateGalleryOnMainPage() {
        const galleryList = document.querySelector('.gallery');
        fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(data => {
                galleryList.innerHTML = "";
                data.forEach(work => {
                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    const trashIcon = document.createElement("i");
                    const title = document.createTextNode(work.title);

                    img.src = work.imageUrl;
                    img.alt = work.title;

                    trashIcon.classList.add('fa', 'fa-trash-alt', 'hidden');
                    trashIcon.style.display = 'none';

                    figure.appendChild(img);
                    figure.appendChild(trashIcon);
                    figure.appendChild(title);
                    figure.dataset.workId = work.id;
                    galleryList.appendChild(figure);
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données :', error);
            });
    }

    galleryList.addEventListener('click', function (event) {
        if (event.target.classList.contains('fa-trash-alt')) {
            const figure = event.target.closest('figure');
            const workId = figure.dataset.workId;
            deleteWork(workId);
        }
    });

    fetch("http://localhost:5678/api/categories")
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de récupération des catégories.');
            }
            return response.json();
        })
        .then(categories => {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorieSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories :', error);
        });

    fetch("http://localhost:5678/api/works")
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de récupération des données.');
            }
            return response.json();
        })
        .then(data => {
            galleryList.innerHTML = "";
            data.forEach(work => {
                const figure = document.createElement("figure");
                const img = document.createElement("img");
                const trashIcon = document.createElement("i");

                img.src = work.imageUrl;
                img.alt = work.title;

                trashIcon.classList.add('fa', 'fa-trash-alt');

                figure.appendChild(img);
                figure.appendChild(trashIcon);
                figure.dataset.workId = work.id;
                galleryList.appendChild(figure);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données :', error);
        });


    function displayAddedPhoto() {
        const inputFile = document.querySelector('.add-new-photo input');
        const modalImg = document.querySelector('.modal-stop.modal-add .preview');
        const contentAddPhotos = document.querySelectorAll('.content-add-photo');

        inputFile.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const imgUrl = URL.createObjectURL(file);
                modalImg.innerHTML = `<img src="${imgUrl}" alt="Photo ajoutée">`;

                contentAddPhotos.forEach(contentAddPhoto => {
                    contentAddPhoto.style.display = 'none';
                });
            }
        });
    }

    function submitPhotoForm() {
        const form = document.querySelector('.form-photo');
        const modalImg = document.querySelector('.modal-stop.modal-add .preview');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const title = document.getElementById('title-photo').value;
            const category = document.getElementById('categorie-photo').value;
            const file = document.getElementById('file').files[0];
            const contentAddPhotos = document.querySelectorAll('.content-add-photo');

            if (title && category && file) {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('title', title);
                formData.append('category', category);

                const token = sessionStorage.getItem('Token');
                fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de l\'envoi du formulaire.');
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert('Le projet a été ajouté avec succès !');
                        form.reset();
                        updateGalleryInModal();
                        modal.style.display = 'none';
                        modalImg.innerHTML = '';
                        contentAddPhotos.forEach(contentAddPhoto => {
                            contentAddPhoto.style.display = 'flex';
                        });
                        updateGalleryOnMainPage();
                    })
                    .catch(error => {
                        console.error('Erreur lors de l\'envoi du formulaire :', error);
                    });
            } else {
                alert('Veuillez remplir tous les champs du formulaire.');
            }
        });
    }

    displayAddedPhoto();
    submitPhotoForm();

});
