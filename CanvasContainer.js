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
    ButtonPress(e){
    }
    ButtonRelease(e){
    }
    MouseMove(e){
        let x = e.offsetX
        let y = e.offsetY
        this.hover_pos.x = x
        this.hover_pos.y = y
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
            this.done_lost_hover_draw = false
        }
        this.canvas.addEventListener('mousedown',(e)=>{
            this.ButtonPress(e)
        })
        this.canvas.addEventListener('mouseup',(e)=>{
            this.ButtonRelease(e)
        })
    }
    DrawIfRequired(){
        if(this.has_hover || !this.done_lost_hover_draw){
            this.done_lost_hover_draw = this.Draw()
        }
    }
}