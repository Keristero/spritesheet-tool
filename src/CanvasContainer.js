class CanvasContainer{
    constructor(id){
        this.id = id
        this.element = document.createElement('div')
        this.container = create_and_append_element('div',this.element)
        this.container.classList.add('scrollable')
        this.canvas = create_and_append_element('canvas',this.container)
        this.canvas.onselectstart = ()=>{return false}//supress selection
        this.ctx = this.canvas.getContext('2d')
        this.hover_pos={x:0,y:0}
        this.has_hover = false
        this.done_lost_hover_draw = false
        this.AddMouseEvents()
    }
    DeleteSelf(){
        this.onDelete()
    }
    MouseDown(e){
        //Selection box code
        if(this.has_hover){
            if(e.button == 0){
                //left click
                this.left_click_held = true
                this.drag_selection_start = {x:this.hover_pos.x,y:this.hover_pos.y}
            }
        }else{
            this.drag_selection_start = null
            this.drag_selection_end = null
        }
    }
    MouseUp(e){
        //Selection box code
        if(e.button == 0){
            //left click
            this.left_click_held = false
        }
    }
    DrawSelectionBox(){
        if(this.drag_selection_start && this.drag_selection_end){
            this.ctx.fillStyle = 'rgba(0,0,255,0.1)'
            let x =  Math.min(this.drag_selection_start.x,this.drag_selection_end.x)
            let y = Math.min(this.drag_selection_start.y,this.drag_selection_end.y)
            let width = Math.max(this.drag_selection_start.x,this.drag_selection_end.x) - x
            let height = Math.max(this.drag_selection_start.y,this.drag_selection_end.y) - y
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
            this.drag_selection_end = this.ConstrainCoordinates(this.hover_pos)
        }
    }
    AddMouseEvents(){
        document.addEventListener('mousemove',(e)=>{
            this.MouseMove(e)
        })
        this.canvas.onmouseover = (e)=>{
            this.has_hover = true
        }
        this.canvas.onmouseout = (e)=>{
            this.has_hover = false
            this.done_lost_hover_draw = false
        }
        document.addEventListener('mouseclick',(e)=>{
            this.MouseClick(e)
        })
        document.addEventListener('mousedown',(e)=>{
            this.MouseDown(e)
        })
        document.addEventListener('mouseup',(e)=>{
            this.MouseUp(e)
        })
    }
    DrawIfRequired(){
        if(this.has_hover || !this.done_lost_hover_draw){
            this.done_lost_hover_draw = this.Draw()
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