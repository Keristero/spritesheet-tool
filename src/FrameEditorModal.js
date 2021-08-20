class FrameEditorModal extends Modal {
    constructor() {
        super()
    }
    PrepareHTML() {
        super.PrepareHTML()
        //Canvas
        this.canvas = create_and_append_element('canvas', this.element)
        this.ctx = this.canvas.getContext('2d')
    }
    DrawFrame(){
        draw_frame_data(frame, this.ctx, anchored_x, anchored_y)
    }
    }
    ImportFrames(selected_frames){
        console.log('importing frames',selected_frames)
        this.OpenModal()
    }
}

let frame_editor_modal = new FrameEditorModal()
document.body.appendChild(frame_editor_modal.element)