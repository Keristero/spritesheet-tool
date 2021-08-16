class ExportModal extends Modal {
    constructor() {
        super()
        this.spacing = "even"
        this.format = ".animation"
    }
    PrepareHTML() {
        super.PrepareHTML()

        //Spacing option
        let p_spacing = create_and_append_element('p', this.element)
        p_spacing.textContent = "Spritesheet Spacing"
        let select_spacing = create_and_append_element('select', p_spacing)
        let option_compact = create_and_append_element('option', select_spacing)
        option_compact.value = "compact"
        option_compact.textContent = "Compact"
        let option_even = create_and_append_element('option', select_spacing)
        option_even.value = "even"
        option_even.textContent = "Even"
        option_even.selected = true
        select_spacing.onchange = () => {
            this.spacing = select_spacing.value
            this.RenderOutput()
        }

        //Output format option
        {
            let p_format = create_and_append_element('p', this.element)
            p_format.textContent = "Animation format"
            let select_format = create_and_append_element('select', p_format)
            let option_json = create_and_append_element('option', select_format)
            option_json.value = ".json"
            option_json.textContent = ".json"
            let option_animation = create_and_append_element('option', select_format)
            option_animation.value = ".animation"
            option_animation.textContent = ".animation"
            option_animation.selected = true
            select_format.onchange = () => {
                this.format = select_format.value
                this.RenderOutput()
            }
        }

        //Canvas
        this.canvas = create_and_append_element('canvas', this.element)
        this.ctx = this.canvas.getContext('2d')

        //Output text preview
        this.pre_output_text = create_and_append_element('pre', this.element)
    }
    OpenModal() {
        super.OpenModal()
        this.RenderOutput()
    }
    RenderOutput() {
        let output_data = this.RenderOutputSheet()
        this.RenderOutputData(output_data)
    }
    RenderOutputSheet() {
        let animation_state_objects = project_memory_manager.animation_state_objects
        let output_data = {}

        if (this.spacing == "even") {
            let max_frame_width = 0
            let max_frame_height = 0
            let max_frame_count = 0
            let animation_state_count = 0

            //Read frame information
            for (let state_id in animation_state_objects) {
                let state_data = animation_state_objects[state_id]
                console.log(state_data)

                let widest_in_state = state_data.GetWidestFrameWidthAnchored()
                let tallest_in_state = state_data.GetTallestFrameHeightAnchored()
                max_frame_width = Math.max(widest_in_state, max_frame_width)
                max_frame_height = Math.max(tallest_in_state, max_frame_height)
                if (state_data.data.frames.length > max_frame_count) {
                    max_frame_count = state_data.data.frames.length
                }
                animation_state_count++
            }

            let half_max_width = max_frame_width / 2
            let half_max_height = max_frame_height / 2
            let x = 0
            let y = 0
            this.canvas.width = max_frame_width * max_frame_count
            this.canvas.height = max_frame_height * animation_state_count
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            for (let state_id in animation_state_objects) {
                let state_object = animation_state_objects[state_id]
                output_data[state_id] = {
                    state_name: state_object.data.state_name,
                    frames: []
                }

                for (let frame of state_object.data.frames) {
                    let { minX, minY, maxX, maxY } = frame.source_bounds
                    let width = maxX - minX
                    let height = maxY - minY
                    let anchor_x = (frame.anchor_pos.x - frame.source_bounds.minX)
                    let anchor_y = (frame.anchor_pos.y - frame.source_bounds.minY)
                    let anchored_x = half_max_width + (x - anchor_x)
                    let anchored_y = half_max_height + (y - anchor_y)
                    //Draw frames to canvas
                    state_object.DrawFrameData(frame, this.ctx, anchored_x, anchored_y)
                    output_data[state_id].frames.push({
                        duration: frame.duration,
                        x: anchored_x,
                        y: anchored_y,
                        width: width,
                        height: height,
                        anchor_x: anchor_x,
                        anchor_y: anchor_y,
                        flip_x: frame.flip_x,
                        flip_y: frame.flip_y
                    })
                    x += max_frame_width
                }
                x = 0
                y += max_frame_height
            }
            console.log('drew even spacing')
        }
        return output_data
    }
    RenderOutputData(output_data){
        if(this.format == ".json"){
            this.pre_output_text.textContent = JSON.stringify(output_data, null, 4)
        }else if(this.format == ".animation"){
            this.pre_output_text.textContent = output_data_to_animation_format(output_data)
        }
    }
}

function output_data_to_animation_format(output_data){
    let output_txt = ""
    for(let animation_state_id in output_data){
        let animation_state = output_data[animation_state_id]
        output_txt += `animation state="${animation_state.state_name}"\n`
        
        for(let frame of animation_state.frames){
            let {duration,x,y,width,height,anchor_x,anchor_y,flip_x,flip_y} = frame
            output_txt += `frame duration="${duration/1000}" x="${x}" y="${y}" w="${width}" h="${height}" originx="${anchor_x}" originy="${anchor_y}"`
            if(flip_x){
                output_txt += ` flipx="1"`
            }
            if(flip_y){
                output_txt += ` flipy="1"`
            }
            output_txt += `\n`
        }

        //Line break between each animation
        output_txt += `\n`
    }
    return output_txt
}

let export_modal = new ExportModal()
document.body.appendChild(export_modal.element)