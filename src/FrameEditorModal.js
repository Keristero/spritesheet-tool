class FrameEditorModal extends Modal {
    constructor() {
        super()
        this.selected_frame_indexes = {}
        this.frames = []
        this.PrepareHTML()
    }
    DrawIfRequired() {
        if (this.is_open) {
            this.frame_select.DrawIfRequired()
            this.DrawFrame()
        }
    }
    PrepareHTML() {
        super.PrepareHTML()
        this.element.style.width = "100%"
        this.element.style.height = "100%"

        this.btn_cancel.textContent = "Close"

        this.h3_title = create_and_append_element('h3', this.element)
        this.h3_title.classList.add('center')
        this.h3_title.textContent = "???"

        //Canvas
        let div_center_canvas = create_and_append_element('div', this.element)
        div_center_canvas.classList.add('center')
        this.canvas = create_and_append_element('canvas', div_center_canvas)
        this.ctx = this.canvas.getContext('2d')
        this.ctx.imageSmoothingEnabled = false
        this.canvas.style.height = "70%"

        this.select_point_name = create_and_append_element('select', this.element)
        let option_anchor = create_and_append_element('option', this.select_point_name)
        option_anchor.selected = true
        option_anchor.textContent = "anchor"
        option_anchor.value = "anchor"

        this.button_import_selected = create_and_append_element('button', this.element)
        this.button_import_selected.textContent = "Import Selected"
        this.button_import_selected.onclick = ()=>{
            this.ImportSelected()
        }


        this.canvas.addEventListener('mousedown',(e)=>{
            this.MouseDown(e)
        })

    }
    ImportSelected(){
        let frames = this.GetSelectedFrames()
        for(let frame of frames){
            if(!frame.anchor_pos){
                window.alert(`One or more selected frames have no anchor point selected`)
                return
            }
        }
        for(let frame of frames){
            let animation_state = project_memory_manager.selected_animation_state_object
            animation_state.AddFrame(frame)
        }
        let highest_index = this.RemoveSelectedFrames()
        if(this.frames.length == 0){
            this.CloseModal()
            return
        }else if(this.frames.length == 1){
            this.selected_frame_indexes[0] = true
        }else{
            if(this.frames[highest_index]){
                this.selected_frame_indexes[highest_index] = true
            }
        }
    }
    GetSelectedFrames(){
        let selected_frames = []
        for(let frame_index in this.selected_frame_indexes){
            selected_frames.push(this.frames[parseInt(frame_index)])
        }
        return selected_frames
    }
    RemoveSelectedFrames(){
        //remove selected frames and return the highest index removed
        let frames = this.GetSelectedFrames()
        let highest_index = 0
        for(let frame_data of frames){
            let frame_index = this.frames.indexOf(frame_data)
            if(frame_index > highest_index){
                highest_index = frame_index
            }
            this.frames.splice(frame_index,1)
            if(frame_index < highest_index){
                highest_index--
            }
        }
        for(let index in this.selected_frame_indexes){
            delete this.selected_frame_indexes[index]
        }
        return Math.max(0,highest_index)
    }
    MouseDown(e){
        let canvas_scale_x = this.canvas.offsetWidth/this.canvas.width
        let canvas_scale_y = this.canvas.offsetHeight/this.canvas.height
        //console.log(canvas_scale_x,canvas_scale_y)
        let x = Math.floor(e.offsetX/canvas_scale_x)
        let y = Math.floor(e.offsetY/canvas_scale_y)
        console.log('mouse',x,y)
        for (let frame_index in this.selected_frame_indexes) {
            let frame = this.frames[frame_index]
            frame.anchor_pos = {x:x+frame.source_bounds.minX,y:y+frame.source_bounds.minY}
        }
    }
    DetectLargestFrame(){
        let max = {width:0,height:0}
        for(let frame of this.frames){
            let {minX,minY,maxX,maxY} = frame.source_bounds
            max.width = Math.max(max.width,maxX-minX)
            max.height = Math.max(max.height,maxY-minY)
        }
        return max
    }
    RescaleCanvasToScreen() {
        let max = this.DetectLargestFrame()
        this.canvas.width = max.width ?? 100
        this.canvas.height = max.height ?? 100
    }
    DrawFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        let frames = this.GetSelectedFrames()
        for (let frame of frames) {
            draw_frame_data(frame, this.ctx, 0, 0)
            this.DrawAnchorForFrame(frame)
        }
    }
    DrawAnchorForFrame(frame){
        if(frame.anchor_pos){
            let {minX,minY} = frame.source_bounds
            let {x,y} = frame.anchor_pos
            let local_x = x-minX
            let local_y = y-minY
            console.log('local',local_x,local_y)
            this.ctx.fillStyle = 'rgba(255,0,0,0.5)'
            this.ctx.fillRect(local_x-3,local_y,7,1)
            this.ctx.fillRect(local_x,local_y-3,1,7)
        }
    }
    ResetData() {
        this.frames = null
        this.selected_frame_indexes = {0:true}
        if (this.frame_select) {
            this.element.removeChild(this.frame_select.element)
            delete this.frame_select
        }
    }
    OpenModal() {
        this.RescaleCanvasToScreen()
        super.OpenModal()
    }
    ImportFrames(frames_to_import) {
        this.ResetData()
        this.frames = frames_to_import
        console.log('importing frames', this.frames)
        this.frame_select = new FrameSelect({ id: 1, selected_frame_indexes: this.selected_frame_indexes, frames: this.frames })
        this.element.appendChild(this.frame_select.element)
        this.button_import_selected.style.display = "inline"
        this.h3_title.textContent = `Importing frames to Animation State ${project_memory_manager.selected_animation_state_object.data.state_name}`
        this.OpenModal()
    }
    EditFrames(frames_to_edit) {
        this.ResetData()
        this.frames = frames_to_edit
        console.log('editing frames', this.frames)
        this.frame_select = new FrameSelect({ id: 1, selected_frame_indexes: this.selected_frame_indexes, frames: this.frames })
        this.element.appendChild(this.frame_select.element)
        this.button_import_selected.style.display = "none"
        this.h3_title.textContent = `Editing frames in Animation State ${project_memory_manager.selected_animation_state_object.data.state_name}`
        this.OpenModal()
    }
}

let frame_editor_modal = new FrameEditorModal()
document.body.appendChild(frame_editor_modal.element)