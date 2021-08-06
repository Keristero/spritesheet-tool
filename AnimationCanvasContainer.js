class AnimationCanvasContainer extends CanvasContainer{
    constructor(image){
        super()
        this.default_props = {
            duration:100,
            flip_x:false,
            flip_y:false,
            anchor_x:0,
            anchor_y:0
        }
        this.AddControlsPane()
        this.state_name = ""
        this.selected = false
        this.frames = []
        this.selected_frames = []
        this.RenderSelectedFrameProps()
    }
    Select(){
        this.element.style.backgroundColor = "rgba(0,255,0,0.1)"
        this.selected = true
    }
    Deselect(){
        this.element.style.backgroundColor = "rgba(0,0,0,0)"
        this.selected = false
    }
    AddFrame(source_image,source_bounds,anchor_pos){
        let {minX, minY, maxX, maxY} = source_bounds
        let canvas = document.createElement('canvas')
        let width = maxX-minX
        let height = maxY-minY
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(source_image,minX,minY,width,height,0,0,width,height)
        let local_anchor_pos = {
            x:this.default_props.anchor_x,
            y:this.default_props.anchor_y
        }
        if(anchor_pos){
            local_anchor_pos.x = anchor_pos.x-minX
            local_anchor_pos.y = anchor_pos.y-minY
        }
        //set frame properties
        canvas.props = {
            duration:this.default_props.duration,
            flip_x:this.default_props.flip_x,
            flip_y:this.default_props.flip_y,
            anchor_x:local_anchor_pos.x,
            anchor_y:local_anchor_pos.y
        }
        this.frames.push(canvas)
        this.element.appendChild(canvas)
        console.log('adding frame',canvas.width)
        this.canvas.width = this.GetWidestFrameWidth()
        this.canvas.height = this.GetTallestFrameHeight()
        canvas.onclick = ()=>{
            if(!keyboard.CtrlIsHeld()){
                this.ClearFrameSelection()
            }
            this.SelectFrame(canvas)
        }
        this.ResetAnimation()
    }
    ClearFrameSelection(){
        this.selected_frames = []
        for(let frame of this.frames){
            frame.classList.remove("selected")
        }
    }
    SelectFrame(canvas){
        if(!canvas || this.selected_frames.indexOf(canvas) >= 0){
            return
        }
        this.selected_frames.push(canvas)
        canvas.classList.add("selected")
        this.RenderSelectedFrameProps()
    }
    RenderSelectedFrameProps(){
        this.div_frame_settings.classList.add("hidden")
        this.p_frame_props.textContent = ""
        for(let canvas of this.selected_frames){
            this.p_frame_props.textContent += JSON.stringify(canvas.props)
            this.div_frame_settings.classList.remove("hidden")
        }
    }
    GetTallestFrameHeight(){
        return get_max_from_object_array(this.frames,"height")
    }
    GetWidestFrameWidth(){
        return get_max_from_object_array(this.frames,"width")
    }
    GetWidestFrameWidthAnchored(){
        let max_width = 0
        for(let frame of this.frames){
            let width = frame.width + frame.props.anchor_x
            if(width > max_width){
                max_width = width
            }
        }
        return max_width
    }
    GetTallestFrameHeightAnchored(){
        let max_height = 0
        for(let frame of this.frames){
            let height = frame.height + frame.props.anchor_y
            if(height > max_height){
                max_height = height
            }
        }
        return max_height
    }
    GetFullWidth(){
        let total = 0
        for(let frame of this.frames){
            total += frame.width
        }
        return total
    }
    ResetAnimation(){
        this.canvas.width = this.GetWidestFrameWidthAnchored()*2
        this.canvas.height = this.GetTallestFrameHeightAnchored()*2
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
    DrawIfRequired(){
        if(this.frames.length > 0 && this.preview && this.preview.needs_redraw){
            this.Draw()
        }
    }
    Draw(){
        let current_frame = this.frames[this.preview.frame_index]
        let x = this.preview.centerX - current_frame.props.anchor_x
        let y = this.preview.centerY - current_frame.props.anchor_y
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.drawImage(current_frame,x,y)
        console.log('drew')
        this.preview.needs_redraw = false
        this.preview.next_frame_timeout = setTimeout(()=>{
            this.preview.needs_redraw = true
            this.preview.frame_index++
            if(this.preview.frame_index >= this.frames.length){
                this.preview.frame_index = 0
            }
            
        },current_frame.props.duration)
    }
    AddControlsPane(){
        this.div_settings = create_and_append_element('div',this.element)

        let btn_delete_sheet = create_and_append_element('button',this.div_settings)
        btn_delete_sheet.textContent = "Remove Animation State"
        btn_delete_sheet.onclick = ()=>{this.DeleteSelf()}

        //let btn_select = create_and_append_element('button',this.div_settings)
        //btn_select.textContent = "Select State"
        this.element.onclick = ()=>{
            SelectAnimationState(this)
        }

        let p_state_name = create_and_append_element('p',this.div_settings)
        p_state_name.textContent = "State Name"

        let inp_state_name = create_and_append_element('input',p_state_name)
        inp_state_name.type = "text"
        inp_state_name.value = this.state_name
        inp_state_name.onchange = (e)=>{
            this.state_name = `${inp_state_name.value}`.toUpperCase()
            console.log(this.state_name)
        }

        let p_frame_duration = create_and_append_element('p',this.div_settings)
        p_frame_duration.textContent = "Frame Duration (seconds)"

        let inp_frame_duration = create_and_append_element('input',p_frame_duration)
        inp_frame_duration.type = "number"
        inp_frame_duration.value = this.default_props.duration
        inp_frame_duration.onchange = (e)=>{
            this.default_props.duration = parseFloat(inp_frame_duration.value)
        }

        let p_flip_x = create_and_append_element('p',this.div_settings)
        p_flip_x.textContent = "Flip horizontally"

        let chk_flip_x = create_and_append_element('input',p_flip_x)
        chk_flip_x.type = "checkbox"
        chk_flip_x.onchange = (e)=>{
            this.default_props.flip_x = chk_flip_x.checked == true
        }

        let p_flip_y = create_and_append_element('p',this.div_settings)
        p_flip_y.textContent = "Flip horizontally"

        let chk_flip_y = create_and_append_element('input',p_flip_y)
        chk_flip_y.type = "checkbox"
        chk_flip_y.onchange = (e)=>{
            this.default_props.flip_y = chk_flip_y.checked == true
        }

        {
            let p_anchor_x = create_and_append_element('p',this.div_settings)
            p_anchor_x.textContent = "Anchor X"

            let inp_anchor_x = create_and_append_element('input',p_anchor_x)
            inp_anchor_x.type = "number"
            inp_anchor_x.onchange = (e)=>{
                this.default_props.anchor_x = parseInt(inp_anchor_x.value)
            }
        }
        {
            let p_anchor_y = create_and_append_element('p',this.div_settings)
            p_anchor_y.textContent = "Anchor Y"

            let inp_anchor_y = create_and_append_element('input',p_anchor_y)
            inp_anchor_y.type = "number"
            inp_anchor_y.onchange = (e)=>{
                this.default_props.anchor_y = parseInt(inp_anchor_y.value)
            }
        }

        

        //Per frame settings
        this.div_frame_settings = create_and_append_element('div',this.div_settings)
        
        let btn_remove_frame = create_and_append_element('button',this.div_frame_settings)
        btn_remove_frame.textContent = "Remove Frame"
        btn_remove_frame.onclick = ()=>{
            for(let frame_canvas of this.selected_frames){
                this.frames.splice(this.frames.indexOf(frame_canvas),1)
                this.element.removeChild(frame_canvas)
                this.ClearFrameSelection()
            }
        }

        let btn_apply_settings_to_frame = create_and_append_element('button',this.div_frame_settings)
        btn_apply_settings_to_frame.textContent = "Apply Settings To Frame"
        btn_apply_settings_to_frame.onclick = ()=>{
            for(let frame_canvas of this.selected_frames){
                this.ApplyPropsToFrame(this.default_props,frame_canvas)
            }
            this.RenderSelectedFrameProps()
        }

        this.p_frame_props = create_and_append_element('p',this.div_frame_settings)
    }
    ApplyPropsToFrame(props,frame_canvas){
        frame_canvas.props = {...props}
        this.ResetAnimation()
    }
    ButtonPress(e){
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