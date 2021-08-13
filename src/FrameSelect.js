class FrameSelect extends CanvasContainer{
    constructor(data){
        let {id,animation_state} = data
        super(id)
        this.animation_state = animation_state
        this.frame_padding_x = 16 //pixels
        this.frame_padding_y = 32
        this.RecomputeCanvasSize()
    }
    DrawIfRequired(){
        if(this.has_hover || this.left_click_held || !this.done_redraw){
            this.Draw()
        }
    }
    RecomputeCanvasSize(){
        let total_width = this.frame_padding_x*2 //to account for outside of first and last frame
        let max_height = 0
        for(let frame_data of this.animation_state.data.frames){
            let {minX, minY, maxX, maxY} = frame_data.source_bounds
            let width = maxX-minX
            let height = maxY-minY
            total_width+=(width+this.frame_padding_x)
            if(height > max_height){
                max_height = height
            }
        }
        this.canvas.width = total_width
        this.canvas.height = max_height+this.frame_padding_y*2
        this.done_redraw = false
    }
    CheckForSelection(selected_region){
        let x = this.frame_padding_x
        let y = this.frame_padding_y
        let selected_frames = []
        for(let frame_index in this.animation_state.data.frames){
            let frame_data = this.animation_state.data.frames[frame_index]
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
            this.animation_state.AddToSelection(frame_index)
        }
        console.log("selected frames",selected_frames)
        this.ClearSelectionBox()
    }
    StartSelectionBox(){
        super.StartSelectionBox()
        this.animation_state.ClearFrameSelection()
    }
    FinishSelectionBox(){
        super.FinishSelectionBox()
        let selected_frames = this.CheckForSelection(this.NormalizeSelectionBox())
        for(let frame_index of selected_frames){
            this.animation_state.AddToSelection(frame_index)
        }
        console.log("selected frames",selected_frames)
        this.ClearSelectionBox()
    }
    Draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        //Draw frames
        let x = this.frame_padding_x
        let y = this.frame_padding_y
        this.ctx.fillStyle = 'rgba(0,0,255,0.1)'
        this.ctx.strokeStyle = 'rgba(0,0,255,1)'
        for(let frame_index in this.animation_state.data.frames){
            let frame_data = this.animation_state.data.frames[frame_index]
            let width = (frame_data.source_bounds.maxX-frame_data.source_bounds.minX)
            let height = (frame_data.source_bounds.maxY-frame_data.source_bounds.minY)
            this.animation_state.DrawFrameData(frame_data,this.ctx,x,y)
            if(this.animation_state.selected_frame_indexes[frame_index]){
                this.ctx.fillRect(x,y,width,height)
                this.ctx.strokeRect(x,y,width,height)
            }
            x += (frame_data.source_bounds.maxX-frame_data.source_bounds.minX)+this.frame_padding_x
        }
        
        this.DrawSelectionBox()
    }
}