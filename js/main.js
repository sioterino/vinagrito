import { DOM } from "./DOM.js"
import { Dialog } from "./Dialog.js"

const dom = new DOM()

dom.favicon()

const criarLista = document.querySelector(".nova-lista")
new Dialog(
    criarLista,
    (data, id) => dom.newList(data, id),
    'criar-lista'
)

dom.loadListasFromStorage()
document.querySelector("#pesquisa").addEventListener("input", (e) => dom.handleSearch(e))
