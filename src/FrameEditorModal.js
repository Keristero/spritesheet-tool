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
    OpenModal(selected_frames) {
        super.OpenModal()
    }
}

let frame_editor_modal = new FrameEditorModal()
document.body.appendChild(frame_editor_modal.element)