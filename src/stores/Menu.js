import { writable } from 'svelte/store'
// import UIDATA from "../stores/UiData.js";

export var State = writable({
    lang: 'ita',
    isFavOpen: false
})

export var Store = writable({
    favs: []
})