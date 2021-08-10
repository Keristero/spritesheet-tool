if (navigator.clipboard) {
    console.log("Clipboard API available");
} else {
    console.error("Clipboard API unavailable");
}

const input_zone = document.getElementById("input_zone");
const states_zone = document.getElementById("states_zone");
const input_canvas_containers = [];
const animation_states = [];
const inp_selection_radius = document.getElementById("inp_selection_radius");
const btn_add_state = document.getElementById("btn_add_state");
const keyboard = new Keyboard()

btn_add_state.onclick = () => {
    project_memory_manager.NewAnimationState()
};

window.addEventListener("paste", async (clipboard_event) => {
    let clipboard_images = GetImagesFromClipboard(clipboard_event);
    for (let image of clipboard_images) {
        console.log(image)
        project_memory_manager.NewInputSheet(image)
    }
});

draw();

function draw() {
    window.requestAnimationFrame(draw);
    for (let input_canvas_container of input_canvas_containers) {
        input_canvas_container.DrawIfRequired();
    }
    for (let animation_state of animation_states) {
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