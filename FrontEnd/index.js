const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");

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


// Fonction pour récupérer les catégories depuis l'API
async function retrieveCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Erreur de récupération des catégories.");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    throw error;
  }
}

// Fonction pour afficher les boutons de catégorie en utilisant les données récupérées depuis l'API
async function displayCategoryButtons() {
  try {
    const categories = await retrieveCategories();
    console.log(categories);
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.id = category.id;
      filtersContainer.appendChild(button);
    });

  } catch (error) {
    console.error("Erreur lors de l'affichage des boutons de catégorie :", error);
  }
}

// Appeler la fonction pour afficher les boutons de catégorie au chargement de la page
displayCategoryButtons();


// Fonction pour filtrer les travaux par catégorie
function filterWorksByCategory(categoryId) {
  fetch("http://localhost:5678/api/works")
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur de récupération des données.');
      }
      return response.json();
    })
    .then(works => {
      let filteredWorks;
      if (categoryId === "0") {
        // Si l'ID de la catégorie est "0", cela signifie "Tous", donc afficher tous les travaux
        filteredWorks = works;
      } else {
        // Sinon, filtrer les travaux par catégorie
        filteredWorks = works.filter(work => work.categoryId == categoryId);
      }
      // Effacer la galerie actuelle
      clearGallery();
      // Afficher les travaux filtrés dans la galerie
      filteredWorks.forEach(work => {
        addWorkToGallery(work);
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données :', error);
      // Gérer l'erreur de récupération des données
    });
}

// Ajouter un écouteur d'événement pour chaque bouton de catégorie
filtersContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const categoryId = event.target.id;
    filterWorksByCategory(categoryId);
  }
});


// document.addEventListener("DOMContentLoaded", function() {
//   // Sélection de l'élément "logout"
//   const logout = document.querySelector("header nav .logout");

//   // Fonction pour mettre à jour le texte du lien en fonction de l'état de connexion
//   function updateLogoutText() {
//       const loged = window.sessionStorage.getItem("loged");

//       if (loged === "true") {
//           logout.textContent = "logout";
//       } else {
//           logout.textContent = "login";
//       }
//   }

//   // Mettre à jour le texte du lien lors du chargement de la page
//   updateLogoutText();

//   // Gérer le clic sur le bouton de déconnexion
//   logout.addEventListener("click", function() {
//       const loged = window.sessionStorage.getItem("loged");

//       if (loged === "true") {
//           window.sessionStorage.setItem("loged", "false");
//       } else {
//           window.sessionStorage.setItem("loged", "true");
//       }
//       // Mettre à jour le texte du lien après connexion ou déconnexion
//       updateLogoutText();
//   });
// });

document.addEventListener("DOMContentLoaded", function() {
  // Sélection de l'élément "logout"
  const logout = document.querySelector("header nav .logout");
  const editionMode = document.getElementById("edition"); // Sélection de l'élément du mode édition
  const modifierButtons = document.querySelectorAll(".modifier"); // Sélection de tous les boutons de modification

  // Fonction pour mettre à jour le texte du lien en fonction de l'état de connexion
  function updateLogoutText() {
      const loged = window.sessionStorage.getItem("loged");

      if (loged === "true") {
          logout.textContent = "logout";
          editionMode.style.display = "flex"; // Utilisation de flex pour afficher le mode édition si connecté
          modifierButtons.forEach(button => button.style.display = "flex"); // Utilisation de flex pour afficher les boutons de modification si connecté
      } else {
          logout.textContent = "login";
          editionMode.style.display = "none"; // Masquer le mode édition si déconnecté
          modifierButtons.forEach(button => button.style.display = "none"); // Masquer les boutons de modification si déconnecté
      }
  }

  // Mettre à jour le texte du lien lors du chargement de la page
  updateLogoutText();

  // Gérer le clic sur le bouton de déconnexion
  logout.addEventListener("click", function() {
      const loged = window.sessionStorage.getItem("loged");

      if (loged === "true") {
          window.sessionStorage.setItem("loged", "false");
      } else {
          window.sessionStorage.setItem("loged", "true");
      }
      // Mettre à jour le texte du lien après connexion ou déconnexion
      updateLogoutText();
  });
});
