class CanvasContainer{
    constructor(){
        this.element = document.createElement('div')
        this.canvas = document.createElement('canvas')
        this.element.appendChild(this.canvas)
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
        if(e.button == 0){
            //left click
            this.FindBoundingBox()
        }else if(e.button == 1){
            //middle click
            this.FillImage()
            let image_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
            let pixel_color = getPixel(image_data,this.hover_pos.x,this.hover_pos.y)
            this.SetTransparentColor(pixel_color)
        }
    }
    AddMouseEvents(){
        this.canvas.addEventListener('mousemove',(e)=>{
            let x = e.offsetX
            let y = e.offsetY
            this.hover_pos.x = x
            this.hover_pos.y = y
            //this.FindBoundingBox() bit intense maybe
        })
        this.canvas.onmouseover = (e)=>{
            this.has_hover = true
        }
        this.canvas.onmouseout = (e)=>{
            this.has_hover = false
            this.done_lost_hover_draw = false
        }
        this.canvas.addEventListener('mouseup',(e)=>{
            this.ButtonPress(e)
        })
    }
    DrawIfRequired(){
        if(this.has_hover || !this.done_lost_hover_draw){
            this.Draw()
        }
        this.done_lost_hover_draw = true
    }
}