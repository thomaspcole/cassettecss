import '../scss/cassettecss.scss'
import { Modal } from './plugins/modal.js'
import { Dropdown } from './plugins/dropdown.js'
import { Accordion } from './plugins/accordion.js'
import { CustomSelect } from './plugins/custom-select.js'

document.addEventListener('DOMContentLoaded', () => {
  Modal.init()
  Dropdown.init()
  Accordion.init()
  CustomSelect.init()
})

const CassetteCSS = { Modal, Dropdown, Accordion, CustomSelect }
window.CassetteCSS = CassetteCSS

export default CassetteCSS
export { Modal, Dropdown, Accordion, CustomSelect }
