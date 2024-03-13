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

    modifierButton.addEventListener('click', function () {
        modal.style.display = 'flex';
        addModal.style.display = 'none';

    });

    closeButton.addEventListener('click', function () {
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

    function updateMainPageGallery(workId) {
        const figure = document.querySelector(`figure[data-work-id="${workId}"]`);
        if (figure) {
            figure.remove(); // Suppression de l'élément du DOM sur la page principale
        } else {
            console.log(`Aucune figure trouvée pour le travail ID: ${workId}`);
        }
    }
   
    
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
                    // trashIcon.style.display = 'none'; // Vous pouvez utiliser cette ligne si vous n'utilisez pas de classe 'hidden'
    
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