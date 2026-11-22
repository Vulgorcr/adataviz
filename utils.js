// * Transforme une donnée brute de l'API
// * en objet simple à utiliser dans l'application.
export const formaterDonnee = (item) => {
  return {
    id: item.id,
    nom: item.nom_commerce || "Commerce sans nom",
    numero: item.num_voie || "",
    rue: item.nom_voie || "Adresse non disponible",
    latitude: item.lat,
    longitude: item.lon
  };
};

/**
 * Recherche un commerce par son adresse complète.
 * Recherche par numéro de voie ou nom de rue.
 * Ne tient pas compte des majuscules.
 */// /**

export const filtrerParAdresse = (donnees, recherche) => {
  const terme = String (recherche ?? "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!terme) {
    return donnees;
  }
  return donnees.filter((item) => {
    const adresse = `${item.numero} ${item.rue}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return adresse.includes(terme);
  });
};

/**
 * Filtre les commerces par nom de rue.
 */
export const filtrerParRue = (donnees, rue) => {
  if (!rue) return donnees;

  return donnees.filter((item) => item.rue === rue);
};

/**
 * Trie les commerces par ordre alphabétique.
 */
export const trierParNom = (donnees) => {
  return [...donnees].sort((a, b) =>
    a.nom.localeCompare(b.nom, "fr")
  );
};

/**
 * Compte le nombre de rues différentes.
 */
export const compterLesRues = (donnees) => {
  const rues = donnees.map((item) => item.rue);
  return new Set(rues).size;
};

/**
 * Retourne les rues les plus représentées.
 */
export const compterParRue = (donnees) => {
  const comptage = {};

  donnees.forEach((item) => {
    comptage[item.rue] = (comptage[item.rue] || 0) + 1;
  });

  return Object.entries(comptage)
    .sort((a, b) => b[1] - a[1]);
};
