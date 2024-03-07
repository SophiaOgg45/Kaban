document.addEventListener("DOMContentLoaded", function () {
    const modifierButton = document.querySelector('.modifier');
    const modal = document.querySelector('.modal');
    const closeButton = modal.querySelector('.close');
    const addPhotoButton = document.querySelector('.add-photo');
    const returnButton = document.querySelector('.return');
    const galleryList = document.querySelector('.gallery-list');
    const categorieSelect = document.getElementById('categorie-photo');

    modifierButton.addEventListener('click', function () {
        modal.style.display = 'flex';
    });

    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    addPhotoButton.addEventListener('click', function () {
        modal.style.display = 'none';
        document.querySelector('.modal-add').style.display = 'flex';
    });

    returnButton.addEventListener('click', function () {
        document.querySelector('.modal-add').style.display = 'none';
        modal.style.display = 'flex';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
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
            // Si la suppression réussit, supprimez l'élément du DOM
            const figure = document.querySelector(`figure[data-work-id="${workId}"]`);
            if (figure) {
                figure.remove();
            } else {
                console.log(`Aucune figure trouvée pour le travail ID: ${workId}`);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la suppression du travail :', error);
            // Gérer l'erreur de suppression du travail
            console.log('Détails de l\'erreur :', error.message)
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
