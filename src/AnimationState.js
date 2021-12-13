class AnimationState extends CanvasContainer{
    constructor(data){
        let {id} = data
        super(id)
        this.data = data
        if(!this.data.default_props){
            this.data.default_props = {
                duration:100,
                flip_x:false,
                flip_y:false,
                anchor_x:0,
                anchor_y:0
            }
        }
        if(!this.data.state_name){
            this.data.state_name = ""
        }
        if(!this.data.frames){
            this.data.frames = []
        }
        if(!this.data.clone_states){
            this.data.clone_states = []
        }
        this.AddControlsPane()
        this.selected = false
        this.selected_frame_indexes = {}
        this.frame_select = new FrameSelect({id:0,selected_frame_indexes:this.selected_frame_indexes,frames:this.data.frames})
        this.div_settings.insertBefore(this.frame_select.element,this.div_frame_settings)
        this.ResetAnimation()
        this.UpdateTabTitle(this.data.state_name)
        if(this.data.collapsed){
            this.ToggleCollapse()
        }
    }
    Select(){
        this.element.style.backgroundColor = "rgba(0,255,0,0.1)"
        this.selected = true
    }
    Deselect(){
        this.element.style.backgroundColor = "rgba(0,0,0,0)"
        this.selected = false
    }
    AddFrame(new_frame_data){
        console.log('Added Frame',new_frame_data)
        this.data.frames.push(new_frame_data)
        this.ResetAnimation()
        this.frame_select.RecomputeCanvasSize()
    }
    ClearFrameSelection(){
        for(let selected_frame_id in this.selected_frame_indexes){
            delete this.selected_frame_indexes[selected_frame_id]
        }
    }
    DeleteSelectedFrames(){
        let frames = this.GetSelectedFrames()
        for(let frame_data of frames){
            this.data.frames.splice(this.data.frames.indexOf(frame_data),1)
        }
        this.ClearFrameSelection()
        this.ResetAnimation()
    }
    AddToSelection(frame_index){
        if(this.data.frames[frame_index]){
            this.selected_frame_indexes[frame_index] = true
        }
    }
    GetWidestFrameWidthAnchored(){
        let max_width = 0
        for(let frame_data of this.data.frames){
            let width = (frame_data.source_bounds.maxX-frame_data.source_bounds.minX) + (frame_data.anchor_pos.x-frame_data.source_bounds.minX)
            if(width > max_width){
                max_width = width
            }
        }
        return max_width
    }
    GetTallestFrameHeightAnchored(){
        let max_height = 0
        for(let frame_data of this.data.frames){
            let height = (frame_data.source_bounds.maxY-frame_data.source_bounds.minY) + (frame_data.anchor_pos.y-frame_data.source_bounds.minY)
            if(height > max_height){
                max_height = height
            }
        }
        return max_height
    }
    ResetAnimation(){
        this.ResizeCanvas(this.GetWidestFrameWidthAnchored()*2,this.GetTallestFrameHeightAnchored()*2)
        if(this.preview && this.preview.next_frame_timeout){
            clearTimeout(this.preview.next_frame_timeout)
        }
        this.preview = {
            frame_index:0,
            needs_redraw:true,
            centerX: parseInt(this.canvas.width/2),
            centerY: parseInt(this.canvas.height/2),
            next_frame_timeout:null
        }
    }
    ToggleCollapse(){
        let collapsed = super.ToggleCollapse()
        this.data.collapsed = collapsed
    }
    DrawIfRequired(){
        if(this.data.frames.length > 0 && this.preview && this.preview.needs_redraw){
            this.Draw()
        }
    }
    Draw(){
        let current_frame_data = this.data.frames[this.preview.frame_index]
        let x = this.preview.centerX - (current_frame_data.anchor_pos.x-current_frame_data.source_bounds.minX)
        let y = this.preview.centerY - (current_frame_data.anchor_pos.y-current_frame_data.source_bounds.minY)
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.save();
        //If the whole animation is flipped, flip
        if(this.data.flip_x){
            this.ctx.translate(this.canvas.width, 0);
            this.ctx.scale(-1, 1);
        }
        if(this.data.flip_y){
            this.ctx.translate(0, this.canvas.height);
            this.ctx.scale(1, -1);
        }
        draw_frame_data(current_frame_data,this.ctx,x,y)
        this.ctx.restore();

        this.preview.needs_redraw = false
        this.preview.next_frame_timeout = setTimeout(()=>{
            this.preview.needs_redraw = true
            this.preview.frame_index++
            if(this.preview.frame_index >= this.data.frames.length){
                this.preview.frame_index = 0
            }
            
        },current_frame_data.duration)
        return true
    }
    AddFlippedState(){
        let clone_state = {
            state_name:"",
            flip_x:false,
            flip_y:false,
            speed_multi:1,
            reverse:false
        }
        this.ShowFlippedState(clone_state)
        this.data.clone_states.push(clone_state)
    }
    ShowFlippedState(clone_state){
        let div_clone_state = create_and_append_element('div',this.div_clone_states)
        let p_state_name = create_and_append_element('p',div_clone_state)
        p_state_name.textContent = "Clone Name"
        let inp_state_name = create_and_append_element('input',p_state_name)
        inp_state_name.type = "text"
        inp_state_name.value = clone_state.state_name
        inp_state_name.onchange = (e)=>{
            clone_state.state_name = `${inp_state_name.value}`.toUpperCase()
            console.log(clone_state.state_name)
        }
        let chk_flip_x = create_and_append_checkbox_with_label('Flip X',div_clone_state)
        chk_flip_x.checked = clone_state.flip_x
        chk_flip_x.onchange = (e)=>{
            clone_state.flip_x = chk_flip_x.checked
            console.log(clone_state.flip_x)
        }
        let chk_flip_y = create_and_append_checkbox_with_label('Flip Y',div_clone_state)
        chk_flip_y.checked = clone_state.flip_y
        chk_flip_y.onchange = (e)=>{
            clone_state.flip_y = chk_flip_y.checked
            console.log(clone_state.flip_y)
        }
        let chk_reverse = create_and_append_checkbox_with_label('Reverse Frame Order',div_clone_state)
        chk_reverse.checked = clone_state.reverse
        chk_reverse.onchange = (e)=>{
            clone_state.reverse = chk_reverse.checked
            console.log(clone_state.reverse)
        }
        let inp_speed_multi = create_and_append_element('input',div_clone_state)
        inp_speed_multi.type = 'number'
        inp_speed_multi.value = clone_state.speed_multi
        inp_speed_multi.onchange = (e)=>{
            clone_state.speed_multi = parseFloat(inp_speed_multi.value)
        }
        let inp_speed_multi_label = create_and_append_element('label',div_clone_state)
        inp_speed_multi_label.textContent = " Speed Multiplier"

        let btn_delete_state = create_and_append_element('button',div_clone_state)
        btn_delete_state.textContent = "Remove Clone State"
        btn_delete_state.onclick = ()=>{
            this.div_clone_states.removeChild(div_clone_state)
            this.data.clone_states.splice(this.data.clone_states.indexOf(clone_state),1)
        }
    }
    AddControlsPane(){
        this.div_settings = create_and_append_element('div',this.contents)

        let btn_delete_sheet = create_and_append_element('button',this.div_settings)
        btn_delete_sheet.textContent = "Remove Animation State"
        btn_delete_sheet.onclick = ()=>{this.DeleteSelf()}

        let btn_add_flipped = create_and_append_element('button',this.div_settings)
        btn_add_flipped.textContent = "Add Clone State"
        btn_add_flipped.onclick = ()=>{this.AddFlippedState()}

        let p_state_name = create_and_append_element('p',this.div_settings)
        p_state_name.textContent = "State Name"

        let inp_state_name = create_and_append_element('input',p_state_name)
        inp_state_name.type = "text"
        inp_state_name.value = this.data.state_name
        inp_state_name.onchange = (e)=>{
            this.data.state_name = `${inp_state_name.value}`.toUpperCase()
            console.log(this.data.state_name)
            this.UpdateTabTitle(this.data.state_name)
        }

        this.div_clone_states = create_and_append_element('div',this.div_settings)

        for(let flipped_state of this.data.clone_states){
            this.ShowFlippedState(flipped_state)
        }

        //Per frame settings
        this.div_frame_settings = create_and_append_element('div',this.div_settings)
        
        
        let btn_remove_frame = create_and_append_element('button',this.div_frame_settings)
        btn_remove_frame.textContent = "Remove Frame"
        btn_remove_frame.onclick = ()=>{
            this.DeleteSelectedFrames()
            this.frame_select.RecomputeCanvasSize()
        }

        let btn_edit_frame = create_and_append_element('button',this.div_frame_settings)
        btn_edit_frame.textContent = "Edit Frames"
        btn_edit_frame.onclick = ()=>{
            frame_editor_modal.EditFrames(this.data.frames.filter((frame,index)=>{
                if(this.selected_frame_indexes[index]){
                    return frame
                }
            }))
        }

        let btn_shift_left = create_and_append_element('button',this.div_frame_settings)
        btn_shift_left.textContent = "Shift Left"
        btn_shift_left.onclick = ()=>{
            swap_array_elements_left(this.data.frames,this.selected_frame_indexes)
        }

        let btn_shift_right = create_and_append_element('button',this.div_frame_settings)
        btn_shift_right.textContent = "Shift Right"
        btn_shift_right.onclick = ()=>{
            swap_array_elements_right(this.data.frames,this.selected_frame_indexes)
        }

        this.p_frame_props = create_and_append_element('p',this.div_frame_settings)
    }
    GetSelectedFrames(){
        return this.data.frames.filter((frame,index)=>{
            if(this.selected_frame_indexes[index]){
                return frame
            }
        })
    }
}

function get_max_from_object_array(arr,numerical_property){
    let max = 0
    for(let obj of arr){
        if(obj[numerical_property] > max){
            max = obj[numerical_property]
        }
    }
    return max
}