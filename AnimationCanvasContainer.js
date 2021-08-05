class AnimationCanvasContainer extends CanvasContainer{
    constructor(image){
        super()
        this.AddControlsPane()
        this.state_name = ""
        this.selected = false
        this.frames = []
        this.selected_frame_index = null
        this.default_frame_duration = 0.2
    }
    Select(){
        this.element.style.backgroundColor = "rgba(0,255,0,0.1)"
        this.selected = true
    }
    Deselect(){
        this.element.style.backgroundColor = "rgba(0,0,0,0)"
        this.selected = false
    }
    AddFrame(source_image,source_bounds){
        let {minX, minY, maxX, maxY} = source_bounds
        let canvas = document.createElement('canvas')
        let width = maxX-minX
        let height = maxY-minY
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(source_image,minX,minY,width,height,0,0,width,height)
        //set frame properties
        canvas.props = {
            duration:this.default_frame_duration
        }
        this.frames.push(canvas)
        this.element.appendChild(canvas)
        console.log('adding frame',canvas.width)
        this.canvas.width = this.GetWidestFrame()
        this.canvas.height = this.GetMaxHeight()
        canvas.onclick = ()=>{
            this.SelectFrame(canvas)
        }
    }
    SelectFrame(canvas){
        if(canvas){
            for(let frame of this.frames){
                frame.classList.remove("selected")
            }
            this.selected_frame_index = this.frames.indexOf(canvas)
            this.p_frame_props.textContent = JSON.stringify(canvas.props)
            canvas.classList.add("selected")
        }else{
            this.selected_frame_index = null
        }
    }
    GetMaxHeight(){
        return get_max_from_object_array(this.frames,"height")
    }
    GetWidestFrame(){
        return get_max_from_object_array(this.frames,"width")
    }
    GetFullWidth(){
        let total = 0
        for(let frame of this.frames){
            total += frame.width
        }
        return total
    }
    Draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
    }
    AddControlsPane(){
        this.div_settings = document.createElement('div')
        this.element.appendChild(this.div_settings)

        let btn_delete_sheet = document.createElement('button')
        btn_delete_sheet.textContent = "Remove Animation State"
        btn_delete_sheet.onclick = ()=>{this.DeleteSelf()}
        this.div_settings.appendChild(btn_delete_sheet)

        let btn_select = document.createElement('button')
        btn_select.textContent = "Select State"
        btn_select.onclick = ()=>{
            SelectAnimationState(this)
        }
        this.div_settings.appendChild(btn_select)

        let p_state_name = document.createElement('p')
        p_state_name.textContent = "State Name"
        this.div_settings.appendChild(p_state_name)

        let inp_state_name = document.createElement('input')
        inp_state_name.type = "text"
        inp_state_name.value = this.state_name
        p_state_name.appendChild(inp_state_name)
        p_state_name.onchange = (e)=>{
            this.state_name = `${inp_state_name.value}`.toUpperCase()
            console.log(this.state_name)
        }

        let p_frame_duration = document.createElement('p')
        p_frame_duration.textContent = "Frame Duration (seconds)"
        this.div_settings.appendChild(p_frame_duration)

        let inp_frame_duration = document.createElement('input')
        inp_frame_duration.type = "number"
        inp_frame_duration.value = this.default_frame_duration
        p_frame_duration.appendChild(inp_frame_duration)
        inp_frame_duration.onchange = (e)=>{
            this.default_frame_duration = parseFloat(inp_frame_duration.value)
            console.log('default duration',this.default_frame_duration)
        }

        let div_frame_settings = document.createElement('div')
        this.div_settings.appendChild(div_frame_settings)
        
        let btn_remove_frame = document.createElement('button')
        btn_remove_frame.textContent = "Remove Frame"
        btn_remove_frame.onclick = ()=>{
            if(this.selected_frame_index !== null){
                let frame_canvas = this.frames[this.selected_frame_index]
                this.frames.splice(this.selected_frame_index,1)
                this.element.removeChild(frame_canvas)
                this.SelectFrame(null)
            }
        }
        div_frame_settings.appendChild(btn_remove_frame)
        this.div_settings.appendChild(div_frame_settings)

        this.p_frame_props = document.createElement('p')
        div_frame_settings.appendChild(this.p_frame_props)
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