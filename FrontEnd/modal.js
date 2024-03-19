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

    });



    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });


    closeButtonAddModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Fonction pour afficher la fenêtre modale "Ajouter une photo"
    function displayAddModal() {
        addPhotoButton.addEventListener('click', function () {
            addModal.style.display = 'flex';
            modalGallery.style.display = 'none';
        });
    }

    // Appel de la fonction pour afficher la fenêtre modale "Ajouter une photo"
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
                // Actualiser la galerie d'images dans la modale
                updateGalleryInModal();
                // Actualiser la galerie d'images sur la page principale
                updateGalleryOnMainPage();

            })
            .catch(error => {
                console.error('Erreur lors de la suppression du travail :', error);
                // Gérer l'erreur de suppression du travail
                console.log('Détails de l\'erreur :', error.message)
            });
    }

    function updateGalleryInModal() {
        // Réinitialiser la galerie d'images dans la modale avec les données les plus récentes
        const modalGallery = document.querySelector('.gallery-list');
        // Vous pouvez recharger les données de la galerie ici en utilisant une nouvelle requête fetch ou une autre méthode de mise à jour des données
        // Par exemple :
        fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(data => {
                // Nettoyer la galerie actuelle
                modalGallery.innerHTML = "";
                // Ajouter les nouvelles images à la galerie
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
        // Réinitialiser la galerie d'images sur la page principale avec les données les plus récentes
        const galleryList = document.querySelector('.gallery');
        // Vous pouvez recharger les données de la galerie ici en utilisant une nouvelle requête fetch ou une autre méthode de mise à jour des données
        // Par exemple :
        fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(data => {
                // Nettoyer la galerie actuelle
                galleryList.innerHTML = "";

                // Ajouter les nouvelles images à la galerie
                data.forEach(work => {
                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    const trashIcon = document.createElement("i");
                    const title = document.createTextNode(work.title); // Créer un nœud de texte pour le titre

                    img.src = work.imageUrl;
                    img.alt = work.title;

                    trashIcon.classList.add('fa', 'fa-trash-alt', 'hidden'); // Ajouter une classe 'hidden' pour masquer l'icône
                    trashIcon.style.display = 'none'; // Vous pouvez utiliser cette ligne si vous n'utilisez pas de classe 'hidden'

                    figure.appendChild(img);
                    figure.appendChild(trashIcon);
                    figure.appendChild(title); // Ajouter le titre à la figure
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
});



function hideAddPhotoContent() {
    const contentAddPhoto = document.querySelector('.content-add-photo');
    if (contentAddPhoto) {
        contentAddPhoto.style.display = 'none';
    }
}

// Ajoutez cette fonction à la fin de votre script
function displayAddedPhoto() {
    const inputFile = document.querySelector('.add-new-photo input');
    const labelFile = document.querySelector('.add-new-photo label');
    const modalImg = document.querySelector('.modal-stop.modal-add .preview');

    // Ajouter un événement pour écouter le changement de fichier
    inputFile.addEventListener('change', function (event) {
        const file = event.target.files[0]; // Obtenir le fichier sélectionné
        if (file) {
            // Créer un objet URL à partir du fichier
            const imgUrl = URL.createObjectURL(file);

            // Afficher l'image dans la fenêtre modale
            modalImg.innerHTML = `<img src="${imgUrl}" alt="Photo ajoutée">`;

            // Masquer les éléments de la div content-add-photo
            hideAddPhotoContent();
        }
    });
}


displayAddedPhoto()

function submitPhotoForm() {
    const form = document.querySelector('.form-photo');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Empêcher le formulaire de se soumettre normalement

        // Récupérer les valeurs du formulaire
        const title = document.getElementById('title-photo').value;
        const category = document.getElementById('categorie-photo').value;
        const file = document.getElementById('file').files[0]; // Obtenir le fichier sélectionné

        if (title && category && file) {
            // Créer un objet FormData pour envoyer les données du formulaire
            const formData = new FormData();
            formData.append('image', file); // Ajouter le fichier image
            formData.append('title', title); // Ajouter le titre
            formData.append('category', category); // Ajouter la catégorie
            // Récupérer le jeton d'authentification depuis la session storage
            const token = sessionStorage.getItem('Token');
            // Envoyer les données du formulaire via fetch
            fetch('http://localhost:5678/api/works', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    // Le type de contenu est défini automatiquement comme 'multipart/form-data'
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur lors de l\'envoi du formulaire.');
                    }
                    return response.json();
                })
                .then(data => {
                    // Si la réponse est réussie, vous pouvez traiter les données retournées ici
                    alert('Le projet a été ajouté avec succès !');
                    // Réinitialiser le formulaire
                    form.reset();
                    // Appeler la fonction pour ajouter la nouvelle photo à la galerie
                    addPhotoToGallery(data);
                    document.querySelector('.modal').style.display = 'none';
                    window.location.reload();


                })
                .catch(error => {
                    alert('Erreur lors de l\'envoi du formulaire :', error);
                });
        } else {
            alert('Veuillez remplir tous les champs du formulaire.');
        }
    });
}

// Appeler la fonction pour soumettre le formulaire lorsque le document est chargé
document.addEventListener("DOMContentLoaded", function () {
    submitPhotoForm();
});

async function addPhotoToGallery(photoData) {
    const galleryList = document.querySelector('.gallery');

    try {
        // Utilisez directement les données de la nouvelle photo (photoData) plutôt que de faire une nouvelle requête fetch
        const newWork = photoData;

        // Créer un nouvel élément figure pour la nouvelle photo
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const title = document.createElement("figcaption");

        // Définir les attributs de l'image
        img.src = newWork.imageUrl;
        img.alt = newWork.title;

        // Définir le texte du titre
        title.textContent = newWork.title;

        // Ajouter l'image et le titre à la figure
        figure.appendChild(img);
        figure.appendChild(title);

        // Ajouter la nouvelle figure à la galerie
        galleryList.appendChild(figure);
        console.log('Nouvelle photo ajoutée à la galerie avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la nouvelle photo à la galerie :', error);
    }
}