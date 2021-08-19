class InputSheet extends CanvasContainer{
    constructor(data){
        let {image_url,id,image_name} = data
        super(id)
        this.data = data
        this.image_loaded = false
        this.image_name = image_name
        this.selected_bounds = []
        this.AddControlsPane()
        this.LoadImage(image_url)
        this.UpdateTabTitle(this.image_name)
        if(this.data.collapsed){
            this.ToggleCollapse()
        }
    }
    async LoadImage(image_url){
        this.image = await LoadImage(image_url)
        this.ResizeCanvas(this.image.width,this.image.height)
        this.ctx.imageSmoothingEnabled = false
        this.FillImage()
        this.image_loaded = true
    }
    AddControlsPane(){

        let btn_combine_selection = create_and_append_element('button',this.contents)
        btn_combine_selection.textContent = "Combine Selection"
        btn_combine_selection.onclick=()=>{
            this.CombineSelection()
        }

        this.div_settings = create_and_append_element('div',this.contents)

        let p_transparent_color = create_and_append_element('p',this.div_settings)
        p_transparent_color.textContent = "Transparency Color (set with scroll click)"

        this.div_transparent_color = create_and_append_element('div',p_transparent_color)
        this.DisplayTransparentColor()

        let btn_delete_sheet = create_and_append_element('button',this.div_settings)
        btn_delete_sheet.textContent = "Remove Input Sheet"
        btn_delete_sheet.onclick = ()=>{this.DeleteSelf()}
    }
    CombineSelection(){
        let new_bounds={
            maxX:0,
            maxY:0,
            minX:this.canvas.width,
            minY:this.canvas.height
        }
        for(let bounds of this.selected_bounds){
            console.log(bounds)
            if(bounds.maxX > new_bounds.maxX){
                new_bounds.maxX = bounds.maxX
            }
            if(bounds.minX < new_bounds.minX){
                new_bounds.minX = bounds.minX
            }
            if(bounds.maxY > new_bounds.maxY){
                new_bounds.maxY = bounds.maxY
            }
            if(bounds.minY < new_bounds.minY){
                new_bounds.minY = bounds.minY
            }
        }
        this.ClearSelectedBounds()
        console.log(new_bounds)
        this.AddSelectedBounds(new_bounds)
        this.done_redraw = false
    }
    FillImage(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.drawImage(this.image,0,0)
    }
    DisplayTransparentColor(){
        this.div_transparent_color.style.backgroundColor = `rgba(${this.data.transparent_color})`
        this.div_transparent_color.textContent = this.data.transparent_color
    }
    get transparent_color(){
        if(this.data.transparent_color){
            return this.data.transparent_color
        }else{
            if(this.image_loaded){
                let image_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
                let pixel_color = getPixel(image_data,0,0)
            }else{
                return [0,0,0,0]
            }
        }
    }
    set transparent_color(new_value){
        this.data.transparent_color = new_value
        this.DisplayTransparentColor()
    }
    ToggleCollapse(){
        let collapsed = super.ToggleCollapse()
        this.data.collapsed = collapsed
    }
    FindBoundingBox(){
        let image_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let {new_box,latest_history} = find_transparent_bounding_box(image_data,this.hover_pos.x,this.hover_pos.y,this.canvas.width,this.canvas.height,this.max_distance,this.transparent_color)
        if(!this.BoundsAreAlreadySelected(new_box)){
            this.AddSelectedBounds(new_box)
        }
    }
    AddSelectedBounds(new_bounds){
        if(new_bounds.minX == new_bounds.maxX || new_bounds.minY == new_bounds.maxY){
            return
        }
        if(!this.BoundsAreAlreadySelected(new_bounds)){
            this.selected_bounds.push(new_bounds)
        }
    }
    StartSelectionBox(){
        super.StartSelectionBox()
        if(!keyboard.CtrlIsHeld()){
            this.ClearSelectedBounds()
        }
        this.FindBoundingBox()
    }
    FinishSelectionBox(){
        super.FinishSelectionBox()
        this.FindBoundingBoxs()
        this.ClearSelectionBox()
    }
    Draw(){
        if(this.image_loaded){
            this.overlay_ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.overlay_ctx.fillStyle = 'rgba(0,0,255,0.1)'
            this.overlay_ctx.strokeStyle = 'rgba(0,0,255,1)'
            for(let bounds of this.selected_bounds){
                let {minX,minY,maxX,maxY} = bounds
                this.overlay_ctx.fillRect(minX,minY,(maxX-minX)+1,(maxY-minY)+1)
                this.overlay_ctx.strokeRect(minX,minY,(maxX-minX)+1,(maxY-minY)+1)
            }
            this.DrawSelectionBox()
            return true
        }
        return false
    }
    ClearSelectedBounds(){
        this.selected_bounds = []
    }
    FindBoundingBoxs(){
        let image_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let {x,y} = this.hover_pos
        let selected_region = this.NormalizeSelectionBox()
        let new_bounds = find_multiple_bounding_boxes(image_data,selected_region.minX,selected_region.minY,selected_region.maxX,selected_region.maxY,this.canvas.width,this.canvas.height,inp_selection_radius.value,this.transparent_color)
        for(let bounds of new_bounds){
            this.AddSelectedBounds(bounds)
        }
    }
    BoundsAreAlreadySelected(bounds){
        for(let existing_bounds of this.selected_bounds){
            if(existing_bounds.minX == bounds.minX && existing_bounds.minY == bounds.minY && existing_bounds.maxX == bounds.maxX && existing_bounds.maxY == bounds.maxY){
                return true
            }
        }
        return false
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

function find_multiple_bounding_boxes(image_data,startX,startY,endX,endY,image_width,image_height,max_distance=1,transparent_color=[0,0,0,0]){
    let history = {}
    let boxes = []
    for(let x = startX; x < endX; x++){
        for(let y = startY; y < endY; y++){
            let pixel = getPixel(image_data,x,y)
            if(history[x] && history[x][y]){
                //If pixel has already been visited
                continue
            }
            let t = transparent_color
            if (pixel[0] == t[0] && pixel[1] == t[1] && pixel[2] == t[2] && pixel[3] == t[3]){
                //If pixel is a transparent color
                continue
            }
            let {new_box,latest_history} = find_transparent_bounding_box(image_data,x,y,image_width,image_height,max_distance,transparent_color,history)
            history = latest_history
            //check if box is already in boxes, otherwise add it
            let box_already_exists = function(boxes,new_box){
                for(let box of boxes){
                    if(box.minX == new_box.minX && box.minY == new_box.minY && box.maxX == new_box.maxX && box.maxY == new_box.maxY){
                        return true
                    }
                }
                return false
            }
            if(!box_already_exists(boxes,new_box)){
                boxes.push(new_box)
            }
        }
    }
    return boxes
}

function find_transparent_bounding_box(image_data,startX,startY,image_width,image_height,max_distance=1,transparent_color=[0,0,0,0],previous_history){
    let stack = [{x:startX,y:startY,d:0}]
    let latest_history = previous_history ?? {}
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
        if(!latest_history[x]){
            latest_history[x] = {}
        }
        if(!latest_history[x][y]){
            latest_history[x][y] = true
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
    let new_box = {minX,minY,maxX,maxY}
    return {new_box,latest_history}
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