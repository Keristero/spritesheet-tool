if (navigator.clipboard) {
    console.log("Clipboard API available");
} else {
    console.error("Clipboard API unavailable");
}

const btn_add_state = document.getElementById("btn_add_state");
const keyboard = new Keyboard()

btn_add_state.onclick = () => {
    project_memory_manager.NewAnimationState()
};

window.addEventListener("paste", async (clipboard_event) => {
    let clipboard_images = GetImagesFromClipboard(clipboard_event);
    for (let image of clipboard_images) {
        console.log(image)
        let image_url = await read_file_as_image_url(image)
        project_memory_manager.NewInputSheet(image_url,image.name)
    }
});

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
    }
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
    for (img of imgs) {
        if (img.type.indexOf("image") == -1) {
            continue;
        }
        var image_object = img.getAsFile();
        images.push(image_object);
    }
    return images
}