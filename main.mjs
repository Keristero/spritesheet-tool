import project_memory_manager from './src/ProjectMemoryManagerSingleton.mjs'
import keyboard from './src/KeyboardSingleton.mjs'
import frame_editor_modal from './src/FrameEditorModalSingleton.mjs'

if (navigator.clipboard) {
    console.log("Clipboard API available");
} else {
    console.error("Clipboard API unavailable");
}

window.addEventListener('OpenFrameImportModal',(event_data)=>{
    console.log('caught event',event_data)
    frame_editor_modal.ImportFrames(event_data.detail)
})
window.addEventListener('OpenFrameEditModal',(event_data)=>{
    console.log('caught event',event_data)
    frame_editor_modal.EditFrames(event_data.detail)
})


const btn_add_state = document.getElementById("btn_add_state");
const btn_select_all = document.getElementById("btn_select_all");
const btn_import_all = document.getElementById("btn_import_all");

btn_add_state.onclick = () => {
    project_memory_manager.NewAnimationState()
};

btn_select_all.onclick = () => {
    for(let input_sheet_id in project_memory_manager.input_sheet_objects){
        let input_sheet = project_memory_manager.input_sheet_objects[input_sheet_id]
        console.log(input_sheet)
        input_sheet.drag_selection_start = {x:1,y:1}
        input_sheet.drag_selection_end = {x:input_sheet.canvas.width-1,y:input_sheet.canvas.height-1}
        console.log(input_sheet.drag_selection_start.x,input_sheet.drag_selection_end.x)
        input_sheet.ClearSelectedBounds()
        input_sheet.FindBoundingBoxs()
        input_sheet.ClearSelectionBox()
        input_sheet.done_redraw = false
    }
};

btn_import_all.onclick = () => {
    let all_frames = []
    for(let input_sheet_id in project_memory_manager.input_sheet_objects){
        let input_sheet = project_memory_manager.input_sheet_objects[input_sheet_id]
        let new_frames = input_sheet.GetSelectedFrames()
        all_frames = all_frames.concat(new_frames)
    }
    if(all_frames.length === 0){
        window.alert("No frames selected")
        return
    }
    if(project_memory_manager.memory.selected_animation_state_id == null){
        window.alert("No animation state selected")
        return
    }
    frame_editor_modal.ImportFrames(all_frames)
};


window.addEventListener("paste", async (clipboard_event) => {
    let clipboard_images = GetImagesFromClipboard(clipboard_event);
    process_input_images(clipboard_images)
});

async function process_input_images(images){
    for (let image of images) {
        console.log(image.name)
        let image_url = await read_file_as_image_url(image)
        if(project_memory_manager.memory.replacement_pending === false){
            project_memory_manager.NewInputSheet(image_url,image.name)
        }else{
            if(images.length != 1){
                window.alert("copy a single image at a time for replacing sheets")
            }
            project_memory_manager.NewInputSheet(image_url,image.name,replacement_pending)
            project_memory_manager.memory.replacement_pending = false
        }
    }
}

function read_file_as_image_url(file) {
    return new Promise((resolve,reject)=>{
        let is_image_regex = /\.(jpe?g|png|gif)$/i
        if(!is_image_regex.test(file.name)){
            reject("File is not .png, .jpg or .gif")
        }
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            resolve(this.result)
        }, false);
        reader.readAsDataURL(file);
    })
}

draw();

function draw() {
    window.requestAnimationFrame(draw);
    for (let input_canvas_container_id in project_memory_manager.input_sheet_objects) {
        let input_canvas_container = project_memory_manager.input_sheet_objects[input_canvas_container_id]
        input_canvas_container.DrawIfRequired();
    }
    for (let animation_state_id in project_memory_manager.animation_state_objects) {
        let animation_state = project_memory_manager.animation_state_objects[animation_state_id]
        animation_state.DrawIfRequired();
        animation_state.frame_select.DrawIfRequired();
    }
    frame_editor_modal.DrawIfRequired()
}

function GetImagesFromClipboard(e) {
    let images = [];
    if (e.clipboardData == false) {
        return false;
    }
    var imgs = e.clipboardData.items;
    if (imgs == undefined) {
        return false;
    }
    for (let img of imgs) {
        if (img.type.indexOf("image") == -1) {
            continue;
        }
        var image_object = img.getAsFile();
        images.push(image_object);
    }
    return images
}

setInterval(()=>{
    if(keyboard.KeyIsHeld("Escape")){
        if(project_memory_manager.memory.replacement_pending !== false){
            window.alert(`Canceled replacement of input sheet (${project_memory_manager.memory.replacement_pending})`)
            project_memory_manager.memory.replacement_pending = false
        }
    }
},16)