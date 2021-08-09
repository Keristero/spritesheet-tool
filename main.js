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
let selected_animation_state = null;

function SelectAnimationState(animation_state) {
    for (let state of animation_states) {
        state.Deselect();
    }
    if(animation_state){
        animation_state.Select();
    }
    selected_animation_state = animation_state;
}

function AddFrameToSelectedState(source_image, source_bounds,anchor_pos) {
    if (!selected_animation_state) {
        return;
    }
    selected_animation_state.AddFrame(source_image,source_bounds,anchor_pos)
}

btn_add_state.onclick = () => {
    let animation_state_container = new AnimationCanvasContainer();
    states_zone.appendChild(animation_state_container.element);
    animation_states.push(animation_state_container);
    animation_state_container.onDelete = () => {
        animation_states.splice(animation_states.indexOf(animation_state_container),1);
        SelectAnimationState(null)
        states_zone.removeChild(animation_state_container.element);
    };
    SelectAnimationState(animation_state_container)
};

window.addEventListener("paste", async (clipboard_event) => {
    let images = await loadClipboardImages(clipboard_event);
    for (let image of images) {
        let input_canvas_container = new InputCanvasContainer(image);
        input_zone.appendChild(input_canvas_container.element);
        input_canvas_containers.push(input_canvas_container);
        input_canvas_container.onDelete = () => {
            input_canvas_containers.splice(
                input_canvas_containers.indexOf(input_canvas_container),
                1
            );
            input_zone.removeChild(input_canvas_container.element);
        };
    }
});

draw();

function draw() {
    window.requestAnimationFrame(draw);
    for (let input_canvas_container of input_canvas_containers) {
        input_canvas_container.DrawIfRequired();
    }
    for (let animation_state of animation_states) {
        //disable preview for testing
        //animation_state.DrawIfRequired();
    }
}

async function loadClipboardImages(e) {
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
        var imgObj = img.getAsFile();
        var url = window.URL || window.webkitURL;
        var src = url.createObjectURL(imgObj);
        images.push(loadImage(src));
    }
    return await Promise.all(images);
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = function (e) {
            resolve(img);
        };
        img.src = src;
    });
}
