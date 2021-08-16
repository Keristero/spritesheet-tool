class Modal{
    constructor(){
        this.PrepareHTML()
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
    }
    OpenModal(){
        this.element.showModal()
    }
}