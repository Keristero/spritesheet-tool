class FrameEditorModal extends Modal {
    constructor() {
        super()
        this.selected_frame_indexes = {}
        this.frames = []
        this.mode = null
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

        this.PreparePointSelectionHTML()

        this.quick_point_select = new QuickPointSelect((x,y)=>{
            let frames = this.GetSelectedFrames()
            for(let frame of frames){
                let {minX,minY,maxX,maxY} = frame.source_bounds
                let width = (maxX-minX)-1
                let height = (maxY-minY)-1
                frame.anchor_pos = {x:Math.round(minX+(width*x)),y:Math.round(minY+(height*y))}
                console.log(frame.anchor_pos)
            }
        })
        this.quick_point_select.ToggleCollapse()
        this.element.appendChild(this.quick_point_select.element)

        this.div_frame_properties = create_and_append_element('div', this.element)
        this.input_duration = create_and_append_element('input', this.div_frame_properties)
        this.input_duration.type = 'number'
        this.input_duration.oninput = ()=>{
            this.UpdatePropertyOfSelectedFrames('duration',this.input_duration.value)
        }
        this.label_duration = create_and_append_element('label', this.div_frame_properties)
        this.label_duration.textContent = "duration (milliseconds)"

        this.chk_flip_x = create_and_append_checkbox_with_label('Flip X',this.div_frame_properties)
        //chk_flip_x.checked = clone_state.flip_x
        this.chk_flip_x.onchange = (e)=>{
            this.UpdatePropertyOfSelectedFrames('flip_x',this.chk_flip_x.checked)
        }
        this.chk_flip_y = create_and_append_checkbox_with_label('Flip Y',this.div_frame_properties)
        //chk_flip_y.checked = clone_state.flip_y
        this.chk_flip_y.onchange = (e)=>{
            this.UpdatePropertyOfSelectedFrames('flip_y',this.chk_flip_y.checked)
        }

        this.button_import_selected = create_and_append_element('button', this.element)
        this.button_import_selected.textContent = "Import Selected"
        this.button_import_selected.onclick = ()=>{
            this.ImportSelected()
        }


        this.canvas.addEventListener('mousedown',(e)=>{
            this.MouseDown(e)
        })

        document.addEventListener('keydown',(e)=>{
            if(this.is_open){
                if(e.code == "Enter"){
                    if(this.mode == "import"){
                        this.ImportSelected()
                    }
                }
            }
        })

    }
    PreparePointSelectionHTML(){
        this.already_added_points = {}
        if(this.custom_point_div){
            this.element.removeChild(this.custom_point_div)
            delete this.custom_point_div
        }
        this.custom_point_div = create_and_append_element('div', this.element)

        this.select_point_name = create_and_append_element('select', this.custom_point_div)
        this.select_point_name.addEventListener('change',(e)=>{

        })

        this.option_anchor = create_and_append_element('option', this.select_point_name)
        this.option_anchor.selected = true
        this.option_anchor.textContent = "anchor"
        this.option_anchor.value = "anchor"
        console.log("LOADING CUSTOM POINTS")
        if(project_memory_manager?.memory?.custom_points){
            //load custom points
            console.log('points',project_memory_manager?.memory?.custom_points)
            for(let custom_point_name in project_memory_manager.memory.custom_points){
                this.AddCustomPointOption(custom_point_name)
            }
        }
        
        this.custom_point_name = create_and_append_element('input', this.custom_point_div)
        this.custom_point_name.type = "text"

        this.custom_point_color = create_and_append_element('input', this.custom_point_div)
        this.custom_point_color.type = "color"

        this.custom_point_new = create_and_append_element('button', this.custom_point_div)
        this.custom_point_new.textContent = "Add new point type"
        this.custom_point_new.onclick = ()=>{
            let new_custom_point_name = this.custom_point_name.value
            let new_custom_point_color = this.custom_point_color.value
            if(!new_custom_point_name || new_custom_point_name == ""){
                window.alert("Please enter a new for the new custom point")
                return
            }
            if(!new_custom_point_color || new_custom_point_color == ""){
                window.alert("Please select a color for the new custom point")
                return
            }
            let rgba_color = hexToRgbA(new_custom_point_color,0.5)
            console.log(rgba_color)
            project_memory_manager.UpdateCustomPoint(new_custom_point_name,rgba_color)
            this.AddCustomPointOption(new_custom_point_name)
            this.custom_point_name.value = ""
        }

        this.custom_point_remove = create_and_append_element('button', this.custom_point_div)
        this.custom_point_remove.textContent = "Remove selected point"
        this.custom_point_remove.onclick = ()=>{
            let selected_point_name = this.select_point_name.value
            if(selected_point_name == "anchor"){
                window.alert('Anchor is a reserved point, and cannot be removed')
                return
            }
            if(window.confirm(`Warning, this will remove the custom point ${selected_point_name} from every frame in your project`)){
                if(project_memory_manager.RemoveCustomPoint(selected_point_name)){
                    if(this.RemoveCustomPointOption(selected_point_name)){
                        this.option_anchor.selected = true
                    }
                }
            }

        }
    }
    AddCustomPointOption(point_name){
        if(point_name.toLowerCase() == "anchor"){
            window.alert(`Cant add a point with reserved name Anchor`)
        }
        if(!this.already_added_points){
            this.already_added_points = {}
        }
        if(!this.already_added_points[point_name]){
            let option_custom = create_and_append_element('option', this.select_point_name)
            option_custom.selected = true
            option_custom.textContent = point_name
            option_custom.value = point_name
            this.already_added_points[point_name] = option_custom
        }else{
            return
        }
    }
    RemoveCustomPointOption(point_name){
        if(this.already_added_points[point_name]){
            this.already_added_points[point_name].remove()
            delete this.already_added_points[point_name]
            return true
        }
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
        if(this.select_point_name.value == "anchor"){
            for (let frame_index in this.selected_frame_indexes) {
                let frame = this.frames[frame_index]
                if(e.button == 0){
                    //left click
                    frame.anchor_pos = {x:x+frame.source_bounds.minX,y:y+frame.source_bounds.minY}
                }else{
                    frame.anchor_pos = null
                }
            }
        }else{
            for (let frame_index in this.selected_frame_indexes) {
                let frame = this.frames[frame_index]
                if(!frame.custom_points){
                    frame.custom_points = {}
                }
                if(e.button == 0){
                    //left click
                    frame.custom_points[this.select_point_name.value] = {x:x+frame.source_bounds.minX,y:y+frame.source_bounds.minY}
                }else{
                    if(frame.custom_points[this.select_point_name.value]){
                        delete frame.custom_points[this.select_point_name.value]
                    }
                }
            }
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
            this.DrawPointsForFrame(frame)
        }
    }
    DrawPointsForFrame(frame){
        if(frame.anchor_pos){
            this.DrawCustomPointForFrame(frame,frame.anchor_pos,'rgba(255,0,0,0.5)')
        }
        if(frame.custom_points){
            for(let point_name in frame.custom_points){
                let point_pos = frame.custom_points[point_name]
                let point_color = 'rgba(0,0,255,0.5)'
                if(project_memory_manager?.memory?.custom_points[point_name]){
                    point_color = project_memory_manager.memory.custom_points[point_name]
                }
                this.DrawCustomPointForFrame(frame,point_pos,point_color)
            }
        }
    }
    DrawCustomPointForFrame(frame,position,color){
        if(position){
            let {minX,minY} = frame.source_bounds
            let {x,y} = position
            let local_x = x-minX
            let local_y = y-minY
            this.ctx.fillStyle = color
            this.ctx.fillRect(local_x-3,local_y,7,1)
            this.ctx.fillRect(local_x,local_y-3,1,7)
        }
    }
    ResetData() {
        this.frames = null
        this.selected_frame_indexes = {0:true}
        if (this.frame_select) {
            this.frame_select.element.removeEventListener('selectionchanged',this.on_select_changed)
            this.element.removeChild(this.frame_select.element)
            delete this.frame_select
        }
    }
    OpenModal() {
        this.RescaleCanvasToScreen()
        this.PreparePointSelectionHTML()
        super.OpenModal()
        this.option_anchor.selected = true
        this.on_select_changed = ()=>{
            this.RefreshFrameProperties()
        }
        this.RefreshFrameProperties()
        this.frame_select.element.addEventListener('selectionchanged',this.on_select_changed)
    }
    UpdatePropertyOfSelectedFrames(key,value){
        let selected_frames = this.GetSelectedFrames()
        for(let frame of selected_frames){
            frame[key] = value
        }
        this.RefreshFrameProperties()
    }
    RefreshFrameProperties(){
        console.log("gottem",this.selected_frame_indexes)
        let selected_frames = this.GetSelectedFrames()
        if(selected_frames.length > 0){
            let first_frame = selected_frames[0]
            console.log(first_frame)
            this.input_duration.value = first_frame.duration
            this.chk_flip_x.checked = first_frame.flip_x
            this.chk_flip_y.checked = first_frame.flip_y
        }
    }
    ImportFrames(frames_to_import) {
        this.ResetData()
        this.frames = frames_to_import
        this.mode = "import"
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
        this.mode = "edit"
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