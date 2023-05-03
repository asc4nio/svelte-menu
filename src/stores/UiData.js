const LANGS = ["ita", "eng"];

const HEADER = "Menu";
const SUBHEADER = {
  ita: "Benvenuti nel nostro ristorante! Abbiamo creato un menu digitale per aiutarvi a navigare la nostra offerta di cibo e bevande. Scegliete i vostri piatti preferiti e preparatevi ad assaporare la nostra prelibata cucina. Buon appetito!",
  eng: "Welcome to our restaurant! We have created a digital menu to help you navigate our food and drink offerings. Choose your favorite dishes, and get ready to taste our delicious cuisine. Enjoy your meal!",
};
const NAV = "Menu";

const PRODUCTGROUPS = [
  {
    ita: {
      title: "Cibo",
      subtitle: "Scopri i nostri deliziosi piatti",
    },
    eng: {
      title: "Food",
      subtitle: "Discover our delicious dishes",
    },
  },
  {
    ita: {
      title: "Bevande",
      subtitle: "Accompagna il tuo pasto con una bevanda",
    },
    eng: {
      title: "Drinks",
      subtitle: "Accompany your meal with a beverage",
    },
  },
];

const FOODGROUPS = {
  ita: ["Antipasti", "Primi", "Secondi", "Dessert"],
  eng: ["Starters", "First courses", "Second Courses", "Dessert"],
};
const DRINKGROUPS = {
  ita: ["Vino rosso", "Vino bianco", "Birre", "Analcolici"],
  eng: ["Red wine", "White wine", "Beers", "Drinks"],
};

const FAVS = {
  title: {
    ita: "Preferiti",
    eng: "Favorites",
  },
  tip: {
    ita: "Clicca su un prodotto per aggiungerlo ai preferiti",
    eng: "Click on a product to add it to your favorites.",
  },
  clearbutton: {
    ita: "Rimuovi tutti",
    eng: "Clear favorites",
  },
};

const CONTACTS = {
  title: {
    ita: "Contatti",
    eng: "Contacts",
  },
  subtitle: {
    ita: "Informazioni sul tuo locale. Via delle vie 17, Città, Provincia, CAP",
    eng: "Information about your business. Via delle Vie 17, City, Province, ZIP code.",
  },
  heading1: {
    ita: "Restiamo in contatto",
    eng: "Keep in touch",
  },
  heading2: {
    ita: "Seguici sui social",
    eng: "Follow us on social media",
  },
};

const UIDATA = {
  LANGS,
  HEADER,
  SUBHEADER,
  NAV,
  PRODUCTGROUPS,
  FOODGROUPS,
  DRINKGROUPS,
  FAVS,
  CONTACTS,
};
export default UIDATA;
