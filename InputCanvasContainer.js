class InputCanvasContainer extends CanvasContainer{
    constructor(image){
        super()
        this.image = image
        this.canvas.width = image.width
        this.canvas.height = image.height
        this.FillImage()
        this.AddControlsPane()
        this.GetDefaultTransparentColor()
    }
    AddControlsPane(){
        this.div_settings = document.createElement('div')
        this.element.appendChild(this.div_settings)

        let p_transparent_color = document.createElement('p')
        p_transparent_color.textContent = "Transparency Color (set with scroll click)"
        this.div_settings.appendChild(p_transparent_color)
        this.div_transparent_color = document.createElement('div')
        this.div_transparent_color.style.backgroundColor = "rgba(255,0,0,0)"
        p_transparent_color.appendChild(this.div_transparent_color)

        let btn_delete_sheet = document.createElement('button')
        btn_delete_sheet.textContent = "Remove Input Sheet"
        btn_delete_sheet.onclick = ()=>{this.DeleteSelf()}
        this.div_settings.appendChild(btn_delete_sheet)
    }
    FillImage(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.drawImage(this.image,0,0)
    }
    SetTransparentColor(new_color){
        this.transparent_color = new_color
        this.div_transparent_color.style.backgroundColor = `rgba(${this.transparent_color})`
        this.div_transparent_color.textContent = this.transparent_color
        console.log(this.transparent_color)
    }
    GetDefaultTransparentColor(){
        let image_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let pixel_color = getPixel(image_data,0,0)
        this.SetTransparentColor(pixel_color)
    }
    ButtonPress(e){
        if(e.button == 0){
            //left click
            this.FillImage()
            if(this.bounds && point_in_bounds(this.hover_pos.x,this.hover_pos.y,this.bounds)){
                AddFrameToSelectedState(this.canvas,this.bounds)
            }else{
                this.FindBoundingBox()
            }
        }else if(e.button == 1){
            //middle click
            this.FillImage()
            let image_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
            let pixel_color = getPixel(image_data,this.hover_pos.x,this.hover_pos.y)
            this.SetTransparentColor(pixel_color)
        }
    }
    Draw(){
        this.FillImage()
        this.ctx.lineWidth = 0.5
        if(this.bounds){
            this.ctx.fillStyle = 'rgba(0,0,255,0.1)'
            let {minX,minY,maxX,maxY} = this.bounds
            this.ctx.fillRect(minX,minY,(maxX-minX)+1,(maxY-minY)+1)
        }
    }
    FindBoundingBox(){
        this.FillImage()
        let image_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let {x,y} = this.hover_pos
        this.bounds = find_transparent_bounding_box(image_data,x,y,this.canvas.width,this.canvas.height,inp_selection_radius.value,this.transparent_color)
        console.log(this.bounds)
    }
}

function point_in_bounds(x,y,bounds){
    console.log(x,y,bounds)
    let {minX,minY,maxX,maxY} = bounds
    if(x >= minX && x <=maxX && y >= minY && y <= maxY){
        return true
    }
    return false
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