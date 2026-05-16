import '../scss/cassettecss.scss'
import { Modal } from './plugins/modal.js'
import { Dropdown } from './plugins/dropdown.js'
import { Accordion } from './plugins/accordion.js'

document.addEventListener('DOMContentLoaded', () => {
  Modal.init()
  Dropdown.init()
  Accordion.init()
})

const CassetteCSS = { Modal, Dropdown, Accordion }
window.CassetteCSS = CassetteCSS

export default CassetteCSS
export { Modal, Dropdown, Accordion }
