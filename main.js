import {
  formaterDonnee,
  filtrerParAdresse,
  filtrerParRue,
  trierParNom,
  compterLesRues
} from "./utils.js";

// Adresse de l'API Open Data de Paris
const API_URL =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/commerces-eau-de-paris/records?limit=100";

// Sélection des éléments HTML
const container = document.querySelector("#commerce-container");
const totalCount = document.querySelector("#total-count");
const resultsCount = document.querySelector("#results-count");
const displayedCount = document.querySelector("#displayed-count");
const streetCount = document.querySelector("#street-count");
const searchInput = document.querySelector("#search-input");
const streetFilter = document.querySelector("#street-filter");
const statusMessage = document.querySelector("#status-message");

// Variables de l'application
let commerces = [];
let totalAPI = 0;


 //Récupère les données depuis l'API.

const recupererDonnees = async () => {
  try {
    statusMessage.textContent = "Chargement des commerces...";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données.");
    }

    const data = await response.json(); //Le code attend que la reponse soit convertie en Js.

    commerces = data.results.map(formaterDonnee); //Chaque donne de l'API passe par ici

    totalAPI = data.total_count;

    totalCount.textContent = totalAPI.toLocaleString("fr-FR");

    remplirFiltre();
    afficherCommerces();

  } catch (error) {
    console.error(error);

    statusMessage.textContent =
      "Impossible de charger les données. Veuillez réessayer.";

    totalCount.textContent = "Indisponible";
  }
};

/**
 * Remplit le menu avec les rues disponibles.
 */
const remplirFiltre = () => { //Cette fonction récupère les noms des rues
  const rues = [...new Set(
    commerces.map((commerce) => commerce.rue) // Extrais uniquement les noms des rues.
  )].sort((a, b) => a.localeCompare(b, "fr")); 
  streetFilter.innerHTML = '<option value="">Toutes les rues</option>';

  rues.forEach((rue) => {
    const option = document.createElement("option");

    option.value = rue;
    option.textContent = rue;

    streetFilter.appendChild(option);
  });
};

/**
 * Affiche les commerces selon leur adresse.
 */
const afficherCommerces = () => {
  const recherche = searchInput.value;
  const rueChoisie = streetFilter.value;

  // Recherche par adresse
  let resultats = filtrerParAdresse(commerces, recherche);

  // Filtre complémentaire par rue
  resultats = filtrerParRue(resultats, rueChoisie);

  // Tri alphabétique
  resultats = trierParNom(resultats);

  container.innerHTML = "";

  resultsCount.textContent =
    `${resultats.length} résultat(s)`;

  displayedCount.textContent = resultats.length;

  streetCount.textContent = compterLesRues(resultats);

  if (resultats.length === 0) {
    statusMessage.textContent =
      "Aucun commerce trouvé à cette adresse.";
    return;
  }

  statusMessage.textContent = "";

  resultats.forEach((commerce) => {
    const card = document.createElement("article");

    card.classList.add("commerce-card");

    const adresse = commerce.numero
      ? `${commerce.numero} ${commerce.rue}`
      : commerce.rue;

    card.innerHTML = `
      <div class="commerce-card-top">
        <span class="commerce-icon">🏪</span>
        <span class="commerce-id">N° ${commerce.id ?? "—"}</span>
      </div>

      <h3>${echapperHTML(commerce.nom)}</h3>

      <p class="commerce-address">
        📍 ${echapperHTML(adresse)}
      </p>

      <span class="commerce-location">
        PARTENAIRE EAU DE PARIS
      </span>
    `;

    container.appendChild(card);
  });
};

/**
 * Protège les textes insérés dans le HTML.
 */
const echapperHTML = (texte) => {
  return String(texte).replace(/[&<>"']/g, (caractere) => {
    const caracteres = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return caracteres[caractere];
  });
};

// Recherche par adresse
searchInput.addEventListener("input", afficherCommerces);

// Filtre par rue
streetFilter.addEventListener("change", afficherCommerces);

// Démarre l'application
recupererDonnees();
