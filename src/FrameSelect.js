class FrameSelect extends CanvasContainer{
    constructor(data){
        let {id,selected_frame_indexes,frames} = data
        super(id)
        this.selected_frame_indexes = selected_frame_indexes
        this.frames = frames
        this.frame_padding_x = 16 //pixels
        this.frame_padding_y = 32
        this.RecomputeCanvasSize()
        this.button_tab_title.textContent = "frames"
    }
    DrawIfRequired(){
        if(this.has_hover || this.left_click_held || !this.done_redraw){
            this.DrawFrames()
            this.DrawSelections()
        }
    }
    RecomputeCanvasSize(){
        let total_width = this.frame_padding_x*2 //to account for outside of first and last frame
        let max_height = 0
        for(let frame_data of this.frames){
            let {minX, minY, maxX, maxY} = frame_data.source_bounds
            let width = maxX-minX
            let height = maxY-minY
            total_width+=(width+this.frame_padding_x)
            if(height > max_height){
                max_height = height
            }
        }
        this.ResizeCanvas(total_width,max_height+this.frame_padding_y*2)
        this.done_redraw = false
    }
    CheckForSelection(selected_region){
        let x = this.frame_padding_x
        let y = this.frame_padding_y
        let selected_frames = []
        for(let frame_index in this.frames){
            let frame_data = this.frames[frame_index]
            let width = (frame_data.source_bounds.maxX-frame_data.source_bounds.minX)
            let height = (frame_data.source_bounds.maxY-frame_data.source_bounds.minY)
            let frame_region = {
                minX:x,
                minY:y,
                maxX:x+width,
                maxY:y+height
            }
            if(rect_overlap(selected_region,frame_region)){
                selected_frames.push(frame_index)
            }
            x += width+this.frame_padding_x
        }
        return selected_frames
    }
    MouseClick(e){
        super.MouseClick(e)
        let selected_frames = this.CheckForSelection({minX:this.hover_pos.x,minY:this.hover_pos.y,maxX:this.hover_pos.x,maxY:this.hover_pos.y})
        for(let frame_index of selected_frames){
            this.AddFrameToSelection(frame_index)
        }
        console.log("selected frames",selected_frames)
        this.ClearSelectionBox()
    }
    StartSelectionBox(){
        super.StartSelectionBox()
        if(!keyboard.CtrlIsHeld()){
            this.ClearSelectedFrames()
        }
    }
    AddFrameToSelection(frame_index){
        this.selected_frame_indexes[frame_index] = true
    }
    ClearSelectedFrames(){
        for(let key in this.selected_frame_indexes){
            delete this.selected_frame_indexes[key]
        }
    }
    FinishSelectionBox(){
        super.FinishSelectionBox()
        let selected_frames = this.CheckForSelection(this.NormalizeSelectionBox())
        for(let frame_index of selected_frames){
            this.AddFrameToSelection(frame_index)
        }
        console.log("selected frames",selected_frames)
        this.ClearSelectionBox()
    }
    DrawFrames(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        //Draw frames
        let x = this.frame_padding_x
        let y = this.frame_padding_y
        for(let frame_index in this.frames){
            let frame_data = this.frames[frame_index]
            let width = (frame_data.source_bounds.maxX-frame_data.source_bounds.minX)
            let height = (frame_data.source_bounds.maxY-frame_data.source_bounds.minY)
            draw_frame_data(frame_data,this.ctx,x,y)
            x += (frame_data.source_bounds.maxX-frame_data.source_bounds.minX)+this.frame_padding_x
        }
    }
    DrawSelections(){
        this.overlay_ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        //Draw frames
        let x = this.frame_padding_x
        let y = this.frame_padding_y
        this.overlay_ctx.fillStyle = 'rgba(0,0,255,0.1)'
        this.overlay_ctx.strokeStyle = 'rgba(0,0,255,1)'
        for(let frame_index in this.frames){
            let frame_data = this.frames[frame_index]
            let width = (frame_data.source_bounds.maxX-frame_data.source_bounds.minX)
            let height = (frame_data.source_bounds.maxY-frame_data.source_bounds.minY)
            if(this.selected_frame_indexes[frame_index]){
                this.overlay_ctx.fillRect(x,y,width,height)
                this.overlay_ctx.strokeRect(x,y,width,height)
            }
            x += (frame_data.source_bounds.maxX-frame_data.source_bounds.minX)+this.frame_padding_x
        }
        this.DrawSelectionBox()
    }
}