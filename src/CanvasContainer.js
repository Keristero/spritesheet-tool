class CanvasContainer{
    constructor(id){
        this.id = id
        this.element = document.createElement('div')
        this.button_tab_title = create_and_append_element('button',this.element)
        this.button_tab_title.textContent = "..."
        this.button_tab_title.classList.add('tab')
        this.button_tab_title.onclick = ()=>{
            let collapsible = this.button_tab_title.nextElementSibling
            if(collapsible.style.display == "none"){
                collapsible.style.display = "block"
            }else{
                collapsible.style.display = "none"
            }
        }
        this.contents = create_and_append_element('div',this.element)
        this.container = create_and_append_element('div',this.contents)
        this.container.classList.add('scrollable')
        this.canvas = create_and_append_element('canvas',this.container)
        this.canvas.onselectstart = ()=>{return false}//supress selection
        this.ctx = this.canvas.getContext('2d')
        this.hover_pos={x:0,y:0}
        this.has_hover = false
        this.done_redraw = false
        this.AddMouseEvents()
    }
    UpdateTabTitle(title_text){
        this.button_tab_title.textContent = title_text
    }
    DeleteSelf(){
        this.onDelete()
    }
    MouseDown(e){
        //Selection box code
        if(this.has_hover){
            if(e.button == 0){
                //left click
                this.ClearSelectionBox()
                this.StartSelectionBox()
            }
        }else{
            this.ClearSelectionBox()
        }
    }
    MouseUp(e){
        //Selection box code
        if(e.button == 0){
            //left click
            if(this.drag_selection_start && this.drag_selection_end){
                this.FinishSelectionBox()
            }
        }
    }
    MouseClick(e){
        if(e.button == 0){
            this.ClearSelectionBox()
        }
    }
    FinishSelectionBox(){
        console.log('finish selection')
        this.left_click_held = false
    }
    ClearSelectionBox(){
        this.left_click_held = false
        this.drag_selection_start = null
        this.drag_selection_end = null
    }
    StartSelectionBox(){
        console.log('start selection')
        this.left_click_held = true
        this.drag_selection_start = {x:this.hover_pos.x,y:this.hover_pos.y}
    }
    NormalizeSelectionBox(){
        let selectionRegion = {
            minX:Math.min(this.drag_selection_start.x,this.drag_selection_end.x),
            minY:Math.min(this.drag_selection_start.y,this.drag_selection_end.y),
            maxX:Math.max(this.drag_selection_start.x,this.drag_selection_end.x),
            maxY:Math.max(this.drag_selection_start.y,this.drag_selection_end.y)
        }
        selectionRegion.width = selectionRegion.maxX-selectionRegion.minX
        selectionRegion.height = selectionRegion.maxY-selectionRegion.minY
        selectionRegion.x = selectionRegion.minX
        selectionRegion.y = selectionRegion.minY
        return selectionRegion
    }
    DrawSelectionBox(){
        if(this.drag_selection_start && this.drag_selection_end){
            this.ctx.fillStyle = 'rgba(0,0,255,0.1)'
            let {x,y,width,height} = this.NormalizeSelectionBox()
            this.ctx.fillRect(x,y,width,height)
        }
    }
    MouseMove(e){
        let x = e.offsetX
        let y = e.offsetY
        this.hover_pos.x = x
        this.hover_pos.y = y

        //Selection box code
        if(this.left_click_held){
            this.drag_selection_end = {x:this.hover_pos.x,y:this.hover_pos.y}
        }
    }
    AddMouseEvents(){
        this.canvas.addEventListener('mousemove',(e)=>{
            this.MouseMove(e)
        })
        this.canvas.onmouseover = (e)=>{
            this.has_hover = true
        }
        this.canvas.onmouseout = (e)=>{
            this.has_hover = false
            this.done_redraw = false
        }
        this.canvas.addEventListener('click',(e)=>{
            this.MouseClick(e)
        })
        this.canvas.addEventListener('mousedown',(e)=>{
            this.MouseDown(e)
        })
        this.canvas.addEventListener('mouseup',(e)=>{
            this.MouseUp(e)
        })
    }
    DrawIfRequired(){
        if(this.has_hover || !this.done_redraw){
            this.done_redraw = this.Draw()
        }
    }
    ConstrainCoordinates(pos){
        //not used right now
        let x = Math.max(0,Math.min(this.element.offsetWidth,pos.x))
        let y = Math.max(0,Math.min(this.element.offsetHeight,pos.y))
        //console.log(x,y)
        return {x:x,y:y}
    }
}