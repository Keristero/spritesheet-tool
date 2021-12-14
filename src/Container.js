class Container{
    constructor(id){
        this.id = id
        this.element = document.createElement('div')
        this.button_tab_title = create_and_append_element('button',this.element)
        this.button_tab_title.textContent = "..."
        this.button_tab_title.classList.add('tab')
        this.button_tab_title.onclick = ()=>{
            this.ToggleCollapse()
        }
        this.contents = create_and_append_element('div',this.element)
        this.contents.classList.add('center')
        this.container = create_and_append_element('div',this.contents)
        this.container.classList.add('canvas_container')
        this.container.classList.add('scrollable')
    }
    ToggleCollapse(){
        let collapsible = this.button_tab_title.nextElementSibling
        if(collapsible.style.display == "none"){
            this.button_tab_title.classList.remove('collapsed')
            collapsible.classList.remove('collapsed')
            collapsible.style.display = "block"
            return false
        }else{
            this.button_tab_title.classList.add('collapsed')
            collapsible.classList.add('collapsed')
            collapsible.style.display = "none"
            return true
        }
    }
    UpdateTabTitle(title_text){
        this.button_tab_title.textContent = title_text
    }
    DeleteSelf(){
        this.onDelete()
    }
}