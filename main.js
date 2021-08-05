if (navigator.clipboard) {
    console.log('Clipboard API available');
} else {
    console.error('Clipboard API unavailable')
}

const input_zone = document.getElementById('input_zone')
const input_canvas_containers = []
const inp_selection_radius = document.getElementById('inp_selection_radius')

window.addEventListener('paste', async(clipboard_event)=>{
    let images = await loadClipboardImages(clipboard_event)
    for(let image of images){
        let input_canvas_container = new InputCanvasContainer(image)
        input_zone.appendChild(input_canvas_container.element)
        input_canvas_containers.push(input_canvas_container)
    }
});

draw()

function draw(){
    window.requestAnimationFrame(draw)
    for(let input_canvas_container of input_canvas_containers){
        input_canvas_container.Draw()
    }
}

async function loadClipboardImages(e){
    let images = []
    if (e.clipboardData == false) {
        return false;
    }
    var imgs = e.clipboardData.items;
    if (imgs == undefined) {
        return false;
    }
    for(img of imgs){
        if (img.type.indexOf("image") == -1){
            continue
        }
        var imgObj = img.getAsFile();
        var url = window.URL || window.webkitURL;
        var src = url.createObjectURL(imgObj);
        images.push(loadImage(src))
    }
    return await Promise.all(images)
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = function (e) {
            resolve(img)
        };
        img.src = src;
    })
}
