import {
  formaterDonnee,
  filtrerParNom,
  filtrerParRue,
  trierParNom,
  compterLesRues,
  compterParRue
} from "./utils.js";

const commerces = [
  {
    id: "1",
    nom: "PAON CAFE",
    numero: "58",
    rue: "RUE SAINT-DOMINIQUE"
  },
  {
    id: "2",
    nom: "BIOCOOP",
    numero: "10",
    rue: "RUE SAINT-DOMINIQUE"
  },
  {
    id: "3",
    nom: "PHARMACIE BAYEN",
    numero: "45",
    rue: "RUE BAYEN"
  }
];

describe("formaterDonnee", () => {
  test("transforme les données de l'API", () => {
    const resultat = formaterDonnee({
      id: "10",
      nom_commerce: "PAON CAFE",
      num_voie: "58",
      nom_voie: "RUE SAINT-DOMINIQUE",
      lat: 48.85,
      lon: 2.30
    });

    expect(resultat.nom).toBe("PAON CAFE");
    expect(resultat.rue).toBe("RUE SAINT-DOMINIQUE");
  });
});

describe("filtrerParNom", () => {
  test("recherche sans tenir compte des majuscules", () => {
    const resultat = filtrerParNom(commerces, "paon");

    expect(resultat).toHaveLength(1);
    expect(resultat[0].nom).toBe("PAON CAFE");
  });
});

describe("filtrerParRue", () => {
  test("retourne les commerces d'une rue", () => {
    const resultat = filtrerParRue(
      commerces,
      "RUE SAINT-DOMINIQUE"
    );

    expect(resultat).toHaveLength(2);
  });

  test("retourne tous les commerces si aucun filtre", () => {
    expect(filtrerParRue(commerces, "")).toHaveLength(3);
  });
});

describe("trierParNom", () => {
  test("trie les commerces par ordre alphabétique", () => {
    const resultat = trierParNom(commerces);

    expect(resultat[0].nom).toBe("BIOCOOP");
    expect(resultat[1].nom).toBe("PAON CAFE");
  });

  test("ne modifie pas le tableau original", () => {
    const original = [...commerces];

    trierParNom(commerces);

    expect(commerces).toEqual(original);
  });
});

describe("compterLesRues", () => {
  test("compte les rues différentes", () => {
    expect(compterLesRues(commerces)).toBe(2);
  });
});

describe("compterParRue", () => {
  test("compte les commerces par rue", () => {
    const resultat = compterParRue(commerces);

    expect(resultat[0]).toEqual([
      "RUE SAINT-DOMINIQUE",
      2
    ]);
  });
});
