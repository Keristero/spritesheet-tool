class ExportModal extends Modal {
    constructor() {
        super()
        this.spacing = "compact"
        this.format = ".animation"
        this.PrepareHTML()
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
        option_compact.selected = true
        let option_even = create_and_append_element('option', select_spacing)
        option_even.value = "even"
        option_even.textContent = "Even"
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
        tag_duplicated_frames(animation_state_objects)
        let output_data = null
        if (this.spacing == "even") {
            output_data = evenly_space(animation_state_objects,this.canvas,this.ctx)
        }
        if (this.spacing == "compact") {
            output_data = compact_space(animation_state_objects,this.canvas,this.ctx)
        }
        for(let animation_state_id in output_data){
            let animation_state = output_data[animation_state_id]
            animation_state.frames.sort((a,b)=>{
                return a.frame_index - b.frame_index
            })
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

function tag_duplicated_frames(animation_state_objects){
    console.log(animation_state_objects)
    let unique_frames = {}
    let frame_to_string = function(frame_data){
        let {minX, minY, maxX, maxY} = frame_data.source_bounds
        let {sheet_id} = frame_data
        return `${sheet_id}_${minX}_${minY}_${maxX}_${maxY}`
    }
    for (let state_id in animation_state_objects) {
        let state_data = animation_state_objects[state_id]
        for(let frame_index in state_data.data.frames){
            let frame = state_data.data.frames[frame_index]
            if(!unique_frames[frame_to_string(frame)]){
                unique_frames[frame_to_string(frame)] = frame
                if(frame.duplicate_of){
                    delete frame.duplicate_of
                }
            }else{
                console.log('detected duplicate frame')
                frame.duplicate_of = unique_frames[frame_to_string(frame)]
            }
        }
    }
}

function compact_space(animation_state_objects,canvas,ctx){
    let output_data = {}
    let max_frame_width = 0
    let max_frame_height = 0
    let max_frame_count = 0
    let animation_state_count = 0

    //Read frame information
    let boxes = []
    let frame_box_mapping = []
    for (let state_id in animation_state_objects) {
        let state_data = animation_state_objects[state_id]
        for(let frame_index in state_data.data.frames){
            let frame = state_data.data.frames[frame_index]
            if(!frame.duplicate_of){
                //dont bother drawing frames that are already used for other animations
                let {minX,minY,maxX,maxY} = frame.source_bounds
                let width = maxX-minX
                let height = maxY-minY
                let box = {
                    frame_index:frame_index,
                    reference:frame,
                    w:width,
                    h:height
                }
                boxes.push(box)
                frame_box_mapping.push({
                    frame:frame,
                    box:box,
                    state_id:state_id
                })
            }else{
                for(let mapping of frame_box_mapping){
                    if(mapping.frame === frame.duplicate_of){
                        frame_box_mapping.push({
                            frame:frame,
                            box:mapping.box,
                            state_id:state_id
                        })
                    }
                }
            }
        }
    }

    let result = potpack(boxes)
    console.log('potpack',result)

    let x = 0
    let y = 0
    canvas.width = result.w
    canvas.height = result.h
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for(let {frame,box,state_id} of frame_box_mapping){
        draw_frame_data(frame, ctx, box.x, box.y)
        if(!output_data[state_id]){
            let state_object = animation_state_objects[state_id]
            output_data[state_id] = {
                state_name: state_object.data.state_name,
                clone_states: state_object.data.clone_states,
                frames: []
            }
        }
        let anchor_x = (frame.anchor_pos.x - frame.source_bounds.minX)
        let anchor_y = (frame.anchor_pos.y - frame.source_bounds.minY)
        output_data[state_id].frames.push({
            frame_index:box.frame_index,
            duration: frame.duration,
            x: box.x,
            y: box.y,
            width: box.w,
            height: box.h,
            anchor_x: anchor_x,
            anchor_y: anchor_y,
            flip_x: frame.flip_x,
            flip_y: frame.flip_y
        })
    }
    console.log('drew compact spacing')
    return output_data
}

function evenly_space(animation_state_objects,canvas,ctx){
    let output_data = {}
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
    canvas.width = max_frame_width * max_frame_count
    canvas.height = max_frame_height * animation_state_count
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let state_id in animation_state_objects) {
        let state_object = animation_state_objects[state_id]
        output_data[state_id] = {
            state_name: state_object.data.state_name,
            clone_states: state_object.data.clone_states,
            frames: []
        }

        for (let frame_index in state_object.data.frames) {
            let frame = state_object.data.frames[frame_index]
            let { minX, minY, maxX, maxY } = frame.source_bounds
            let width = maxX - minX
            let height = maxY - minY
            let anchor_x = (frame.anchor_pos.x - frame.source_bounds.minX)
            let anchor_y = (frame.anchor_pos.y - frame.source_bounds.minY)
            let anchored_x = half_max_width + (x - anchor_x)
            let anchored_y = half_max_height + (y - anchor_y)
            //Draw frames to canvas
            draw_frame_data(frame, ctx, anchored_x, anchored_y)
            output_data[state_id].frames.push({
                frame_index:frame_index,
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
    return output_data
}

function output_data_to_animation_format(output_data){
    let output_txt = ""
    for(let animation_state_id in output_data){
        let animation_state = output_data[animation_state_id]
        console.log(animation_state)

        let copies = [{state_name:animation_state.state_name,flip_x:false,flip_y:false,speed_multi:1}]

        for(let clone_state of animation_state.clone_states){
            copies.push(clone_state)
        }

        for(let copy of copies){
            let {state_name,flip_x,flip_y,speed_multi,reverse} = copy

            output_txt += `animation state="${state_name}"\n`

            if(reverse){
                //Reverse the array if it should be reversed
                animation_state.frames.reverse()
            }
            for(let frame of animation_state.frames){
                let frame_ref = frame
                if(frame.duplicate_of){
                    frame_ref = frame.duplicate_of
                }
                let {x,y,width,height} = frame_ref
                let {duration,anchor_x,anchor_y} = frame

                out_flipped_x = frame.flip_x ? !flip_x : flip_x
                out_flipped_y = frame.flip_y ? !flip_y : flip_y

                let frame_duration = round_to_decimal_points(duration/(1000*speed_multi),3)

                

                output_txt += `frame duration="${frame_duration}" x="${x}" y="${y}" w="${width}" h="${height}" originx="${anchor_x}" originy="${anchor_y}"`
                if(out_flipped_x){
                    output_txt += ` flipx="1"`
                }
                if(out_flipped_y){
                    output_txt += ` flipy="1"`
                }
                output_txt += `\n`
            }
            if(reverse){
                //Reverse the array again when we are done to put it back in the correct order
                animation_state.frames.reverse()
            }

            //Line break between each animation
            output_txt += `\n`
        }
    }
    return output_txt
}

let export_modal = new ExportModal()
document.body.appendChild(export_modal.element)