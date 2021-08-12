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
    CheckForSelection(){
        let selected_region = this.NormalizeSelectionBox()
        //Draw frames
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
    FinishSelectionBox(){
        super.FinishSelectionBox()
        let selected_frames = this.CheckForSelection()
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
        for(let frame_index in this.animation_state.data.frames){
            let frame_data = this.animation_state.data.frames[frame_index]
            this.animation_state.DrawFrameData(frame_data,this.ctx,x,y)
            x += (frame_data.source_bounds.maxX-frame_data.source_bounds.minX)+this.frame_padding_x
        }
        
        this.DrawSelectionBox()
    }
}