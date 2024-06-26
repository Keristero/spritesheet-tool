import { create_and_append_element } from "./helpers.mjs"

class Modal{
    constructor(){
        this.is_open = false
    }
    PrepareHTML(){
        this.element = document.createElement('dialog')
        this.btn_cancel = create_and_append_element('button',this.element)
        this.btn_cancel.textContent = "Cancel"
        this.btn_cancel.onclick = ()=>{
            this.CloseModal()
        }
    }
    CloseModal(){
        this.element.close()
        this.is_open = false
    }
    OpenModal(){
        this.element.showModal()
        this.is_open = true
    }
}

export default Modal