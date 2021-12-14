class AnimationStatePreview{
    constructor(animation_state_data){
        console.log(animation_state_data)
        this.element = document.createElement('div')
        this.element.classList.add('frame_preview_contents')
        this.canvas = create_and_append_element('canvas',this.element)
        this.canvas.onselectstart = ()=>{return false}//supress selection
        this.ctx = this.canvas.getContext('2d')
        this.ctx.imageSmoothingEnabled = false

        this.data = animation_state_data
        if(!this.data.state_name){
            this.data.state_name = ""
        }
        if(!this.data.frames){
            this.data.frames = []
        }

        this.playback_speed = 1

        this.AddControlsPane()
        this.ResetAnimation()
    }
    ResizeCanvas(width,height){
        this.element.style.width = width
        this.element.style.height = height
        this.canvas.width = width
        this.canvas.height = height
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
        this.ResizeCanvas(this.GetWidestFrameWidthAnchored()*1.5,this.GetTallestFrameHeightAnchored()*1.5)
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
        if(current_frame_data.flip_x){
            this.ctx.translate(this.canvas.width, 0);
            this.ctx.scale(-1, 1);
        }
        if(current_frame_data.flip_y){
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
            
        },current_frame_data.duration/this.playback_speed)
        return true
    }
    AddControlsPane(){
        this.div_settings = create_and_append_element('div',this.element)
        this.div_settings.style.textAlign = "left"

        let p_playback_speed_indicator = create_and_append_element('p',this.div_settings)
        p_playback_speed_indicator.textContent = `playback speed: ${this.playback_speed}`

        let inp_playback_speed = create_and_append_element('input',this.div_settings)
        inp_playback_speed.type = "range"
        inp_playback_speed.min = 1
        inp_playback_speed.max = 10
        inp_playback_speed.value = 5
        inp_playback_speed.onchange = (e)=>{
            this.playback_speed = inp_playback_speed.value/4
            p_playback_speed_indicator.textContent = `playback speed: ${this.playback_speed}x`
        }

    }
}