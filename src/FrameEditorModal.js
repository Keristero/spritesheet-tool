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

        this.canvas.addEventListener('mousemove',(e)=>{
            this.MouseDown(e)
        })

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
        let selected_frame_count = Object.keys(this.selected_frame_indexes).length
        for (let frame_index in this.selected_frame_indexes) {
            let frame = this.frames[frame_index]
            draw_frame_data(frame, this.ctx, 0, 0)
            this.DrawAnchorForFrame(frame)
        }
    }
    DrawAnchorForFrame(frame){
        let {minX,minY} = frame.source_bounds
        let {x,y} = frame.anchor_pos
        let local_x = x-minX
        let local_y = y-minY
        console.log('local',local_x,local_y)
        this.ctx.fillStyle = 'rgba(255,0,0,0.5)'
        this.ctx.fillRect(local_x-3,local_y,7,1)
        this.ctx.fillRect(local_x,local_y-3,1,7)
    }
    ResetData() {
        this.frames = null
        this.selected_frame_indexes = {}
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
        this.OpenModal()
    }
    EditFrames(frames_to_edit) {
        this.ResetData()
        this.frames = frames_to_edit
        console.log('editing frames', this.frames)
        this.frame_select = new FrameSelect({ id: 1, selected_frame_indexes: this.selected_frame_indexes, frames: this.frames })
        this.element.appendChild(this.frame_select.element)
        this.OpenModal()
    }
}

let frame_editor_modal = new FrameEditorModal()
document.body.appendChild(frame_editor_modal.element)