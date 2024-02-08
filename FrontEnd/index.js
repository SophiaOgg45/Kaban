const gallery = document.querySelector(".gallery");

// Fonction pour créer une figure pour chaque travail et l'ajouter à la galerie
const addWorkToGallery = (work) => {
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  image.src = work.imageUrl;
  image.alt = work.title;
  figcaption.textContent = work.title;

  figure.appendChild(image);
  figure.appendChild(figcaption);

  gallery.appendChild(figure);
};

// Fonction pour supprimer les travaux existants de la galerie
const clearGallery = () => {
  gallery.innerHTML = ''; // Supprimer tous les enfants de la galerie
};

// Fonction pour récupérer les travaux depuis l'API
const retrieveWorks = () => {
  fetch("http://localhost:5678/api/works")
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur de récupération des données.');
      }
      return response.json();
    })
    .then(data => {
      // Afficher les données récupérées dans la console
      console.log('Données récupérées :', data);
      
      // Supprimer les travaux existants de la galerie
      clearGallery();
      
      // Ajouter les nouveaux travaux à la galerie
      data.forEach(work => {
        addWorkToGallery(work);
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données :', error);
      // Gérer l'erreur de récupération des données
    });
};

// Appeler la fonction pour récupérer les travaux
retrieveWorks();



  

