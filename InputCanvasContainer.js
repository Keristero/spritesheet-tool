class InputCanvasContainer extends CanvasContainer{
    constructor(data){
        let {image_url,id} = data
        super(id)
        this.data = data
        this.image_loaded = false
        this.AddControlsPane()
        this.LoadImage(image_url)
    }
    async LoadImage(image_url){
        this.image = await LoadImage(image_url)
        this.canvas.width = this.image.width
        this.canvas.height = this.image.height
        this.ctx.imageSmoothingEnabled = false
        this.FillImage()
        this.GetDefaultTransparentColor()
        this.image_loaded = true
    }
    AddControlsPane(){
        this.div_settings = create_and_append_element('div',this.element)

        let p_transparent_color = create_and_append_element('p',this.div_settings)
        p_transparent_color.textContent = "Transparency Color (set with scroll click)"

        this.inp_zoom_scale = create_and_append_element('div',p_transparent_color)
        this.inp_zoom_scale.style.backgroundColor = "rgba(255,0,0,0)"

        let btn_delete_sheet = create_and_append_element('button',this.div_settings)
        btn_delete_sheet.textContent = "Remove Input Sheet"
        btn_delete_sheet.onclick = ()=>{this.DeleteSelf()}
    }
    FillImage(){
        if(this.image_loaded){
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.ctx.drawImage(this.image,0,0)
        }
    }
    SetTransparentColor(new_color){
        this.transparent_color = new_color
        this.inp_zoom_scale.style.backgroundColor = `rgba(${this.transparent_color})`
        this.inp_zoom_scale.textContent = this.transparent_color
        console.log(this.transparent_color)
    }
    GetDefaultTransparentColor(){
        let image_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let pixel_color = getPixel(image_data,0,0)
        this.SetTransparentColor(pixel_color)
    }
    ButtonRelease(e){
        if(e.button == 0){
            //left click
            this.moving_anchor = false
        }else if(e.button == 1){
            //middle click
            this.FillImage()
            let image_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
            let pixel_color = getPixel(image_data,this.hover_pos.x,this.hover_pos.y)
            this.SetTransparentColor(pixel_color)
        }
    }
    ButtonPress(e){
        if(e.button == 0){
            //left click
            this.FillImage()
            if(this.bounds && point_in_bounds(this.hover_pos.x,this.hover_pos.y,this.bounds)){
                project_memory_manager.AddFrameToSelectedState(this.canvas,this.bounds,this.anchor)
            }else{
                this.FindBoundingBox()
                this.moving_anchor = true
            }
        }
    }
    MouseMove(e){
        super.MouseMove(e)
        if(this.moving_anchor){
            this.anchor = {x:this.hover_pos.x,y:this.hover_pos.y}
        }
    }
    Draw(){
        this.FillImage()
        if(this.bounds){
            this.ctx.fillStyle = 'rgba(0,0,255,0.1)'
            let {minX,minY,maxX,maxY} = this.bounds
            this.ctx.fillRect(minX,minY,(maxX-minX)+1,(maxY-minY)+1)
        }
        if(this.anchor && this.bounds){
            this.DrawAnchor()
        }
    }
    DrawAnchor(){
        this.ctx.fillStyle = "rgba(255,0,0,1)"
        if(this.moving_anchor){
            this.ctx.fillStyle = "rgba(255,0,0,0.5)"
        }
        this.ctx.fillRect(this.anchor.x-5,this.anchor.y,11,1)
        this.ctx.fillRect(this.anchor.x,this.anchor.y-5,1,11)
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