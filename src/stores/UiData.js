const LANGS = ['ita', 'eng']

const HEADER = 'Menu';
const SUBHEADER = {
    ita: 'Benvenuti nel nostro ristorante! Abbiamo creato un menu digitale per aiutarvi a navigare la nostra offerta di cibo e bevande. Sfogliate le pagine, scegliete i vostri piatti preferiti e preparatevi ad assaporare la nostra prelibata cucina. Buon appetito!',
    eng: 'Welcome to our restaurant! We have created a digital menu to help you navigate our food and drink offerings. Browse through the pages, choose your favorite dishes, and get ready to taste our delicious cuisine. Enjoy your meal!'
}
const NAV = 'Menu';

const PRODUCTGROUPS = [
    {
        ita: {
            title: 'Cibo',
            subtitle: 'Scopri i nostri deliziosi piatti'
        },
        eng: {
            title: 'Food',
            subtitle: 'Translate: Scopri i nostri deliziosi piatti'
        }
    },
    {
        ita: {
            title: 'Bevande',
            subtitle: 'Scopri i nostri deliziosi piatti'
        },
        eng: {
            title: 'Drinks',
            subtitle: 'Translate: Scopri i nostri deliziosi piatti'
        }
    }
]


const FOODGROUPS = {
    ita: ['Antipasti', 'Primi', 'Secondi', 'Dessert'],
    eng: ['Starters', 'First courses', 'Second Courses', 'Dessert']
}
const DRINKGROUPS = {
    ita: ['Vino rosso', 'Vino bianco', 'Birre', 'Analcolici'],
    eng: ['Red wine', 'White wine', 'Beers', 'Drinks']
}

const FAVSTITLE = {
    ita: "Preferiti",
    eng: "Favorites"
}
const FAVSCLEARBUTTON = {
    ita: "Rimuovi tutti",
    eng: "Clear favorites"
}

const UIDATA = {
    LANGS,
    HEADER,
    SUBHEADER,
    NAV,
    PRODUCTGROUPS,
    FOODGROUPS,
    DRINKGROUPS,
    FAVSTITLE,
    FAVSCLEARBUTTON
}
export default UIDATA