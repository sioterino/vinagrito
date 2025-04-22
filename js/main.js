import { DOM } from "./DOM.js"
import { Dialog } from "./Dialog.js"
import { Utils } from "./Utils.js"

const dom = new DOM()

dom.favicon()

const criarLista = document.querySelector(".nova-lista")
new Dialog(criarLista, (data, id) => this.newList(data, id))

dom.loadListasFromStorage()
document.querySelector("#pesquisa").addEventListener("input", (e) => dom.handleSearch(e))

// dom.pageInit()
