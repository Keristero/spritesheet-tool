class CanvasContainer extends Container{
    constructor(id){
        super(id)
        this.canvas = create_and_append_element('canvas',this.container)
        this.canvas.onselectstart = ()=>{return false}//supress selection
        this.overlay_canvas = create_and_append_element('canvas',this.container)
        this.overlay_canvas.onselectstart = ()=>{return false}//supress selection
        this.overlay_canvas.classList.add('overlay')
        this.ctx = this.canvas.getContext('2d')
        this.ctx.imageSmoothingEnabled = false
        this.overlay_ctx = this.overlay_canvas.getContext('2d')
        this.hover_pos={x:0,y:0}
        this.has_hover = false
        this.done_redraw = false
        this.AddMouseEvents()
    }
    ResizeCanvas(width,height){
        this.container.style.width = width
        this.container.style.height = height
        this.overlay_canvas.width = width
        this.overlay_canvas.height = height
        this.canvas.width = width
        this.canvas.height = height
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
            this.overlay_ctx.fillStyle = 'rgba(0,0,255,0.1)'
            let {x,y,width,height} = this.NormalizeSelectionBox()
            this.overlay_ctx.fillRect(x,y,width,height)
        }
    }
    MouseOut(e){
        this.ClearSelectionBox()
    }
    MouseIn(e){
        this.ClearSelectionBox()
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
        this.overlay_canvas.addEventListener('mousemove',(e)=>{
            this.MouseMove(e)
        })
        this.overlay_canvas.onmouseover = (e)=>{
            this.has_hover = true
        }
        this.overlay_canvas.onmouseout = (e)=>{
            this.has_hover = false
            this.done_redraw = false
        }
        this.overlay_canvas.addEventListener('click',(e)=>{
            this.MouseClick(e)
        })
        this.overlay_canvas.addEventListener('mousedown',(e)=>{
            this.MouseDown(e)
        })
        this.overlay_canvas.addEventListener('mouseout',(e)=>{
            this.MouseOut(e)
        })
        this.overlay_canvas.addEventListener('mouseup',(e)=>{
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