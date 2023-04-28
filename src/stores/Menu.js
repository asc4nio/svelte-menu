import { writable } from 'svelte/store'
import UIDATA from "../stores/UiData.js";

export var State = writable({
    lang: UIDATA.LANGS[0],
    isFavOpen: false
})

export var Store = writable({
    favs: []
})