class InputCanvasContainer{
    constructor(image){
        this.element = document.createElement('div')
        this.canvas = document.createElement('canvas')
        this.element.appendChild(this.canvas)
        this.ctx = this.canvas.getContext('2d')
        this.image = image
        this.canvas.width = image.width
        this.canvas.height = image.height
        this.ctx.drawImage(this.image,0,0)
        this.AddMouseEvents()
        this.hover_pos={x:0,y:0}
        this.has_hover = false
        this.done_lost_hover_draw = false
    }
    AddMouseEvents(){
        this.canvas.addEventListener('mousemove',(e)=>{
            let x = e.offsetX
            let y = e.offsetY
            this.hover_pos.x = x
            this.hover_pos.y = y
        })
        this.canvas.onmouseover = (e)=>{
            this.has_hover = true
        }
        this.canvas.onmouseout = (e)=>{
            this.has_hover = false
            this.done_lost_hover_draw = false
        }
        this.canvas.addEventListener('mouseup',(e)=>{
            this.FindBoundingBox()
        })
    }
    Draw(){
        if(this.has_hover || !this.done_lost_hover_draw){
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.ctx.drawImage(this.image,0,0)
            this.ctx.lineWidth = 0.5
            if(this.bounds){
                this.ctx.fillStyle = 'rgba(0,0,255,0.1)'
                let {minX,minY,maxX,maxY} = this.bounds
                this.ctx.fillRect(minX,minY,(maxX-minX)+1,(maxY-minY)+1)
            }
            this.done_lost_hover_draw = true
        }
    }
    FindBoundingBox(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.drawImage(this.image,0,0)
        let image_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let {x,y} = this.hover_pos
        this.bounds = find_transparent_bounding_box(image_data,x,y,this.canvas.width,this.canvas.height,inp_selection_radius.value)
        console.log(this.bounds)
    }
}

function find_transparent_bounding_box(image_data,startX,startY,image_width,image_height,max_distance=1,transparent_color=[0,0,0,0]){
    let stack = [{x:startX,y:startY,d:0}]
    let history = {}
    let minX = startX
    let minY = startY
    let maxX = startX
    let maxY = startY
    let t = transparent_color
    let add_tile_to_stack = (x,y,d)=>{
        //dont add a tile out of bounds
        if(x < 0 || x > image_width || y < 0 || y > image_height){
            return
        }
        if(!history[x]){
            history[x] = {}
        }
        if(!history[x][y]){
            history[x][y] = true
            stack.push({x:x,y:y,d:d})
        }
    }
    while(stack.length > 0){
        let {x,y,d} = stack.shift()
        //add adjacent tiles to stack if tile is not transparent
        let pixel = getPixel(image_data,x,y)
        if (!(pixel[0] == t[0] && pixel[1] == t[1] && pixel[2] == t[2] && pixel[3] == t[3])){
            add_tile_to_stack(x+1,y,0)
            add_tile_to_stack(x-1,y,0)
            add_tile_to_stack(x,y+1,0)
            add_tile_to_stack(x,y-1,0)
            if(x > maxX){
                maxX = x
            }else if(x < minX){
                minX = x
            }
            if(y > maxY){
                maxY = y
            }else if(y < minY){
                minY = y
            }
        }else if(d < max_distance){
            add_tile_to_stack(x+1,y,d+1)
            add_tile_to_stack(x-1,y,d+1)
            add_tile_to_stack(x,y+1,d+1)
            add_tile_to_stack(x,y-1,d+1)
        }
    }
    return {minX,minY,maxX,maxY}
}

/* Layer 1: Interacting with ImageData */

/**
 * Returns the pixel array at the specified position.
 */
 function getPixel(imageData, x, y) {
    return getPixelByIndex(imageData, pos2index(imageData, x, y));
}

/**
 * Returns the RGBA values at the specified index.
 */
function getPixelByIndex(imageData, index) {
    return [
        imageData.data[index + 0],
        imageData.data[index + 1],
        imageData.data[index + 2],
        imageData.data[index + 3],
    ];
}

function pos2index(imageData, x, y) {
    return 4 * (y * imageData.width + x);
}