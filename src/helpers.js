function create_and_append_element(element_tag,parent){
    let new_element = document.createElement(element_tag)
    parent.appendChild(new_element)
    return new_element
}

function download_json_file(filename,text){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/text;charset=utf-8,' + text );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function sleep(milliseconds){
    return new Promise((reoslve)=>{
        setTimeout(reoslve,milliseconds)
    })
}

function LoadImage(src) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = function (e) {
            resolve(img);
        };
        img.src = src;
    });
}

function rect_overlap(region1,region2){
    if (region1.minX < region2.maxX &&
        region1.maxX > region2.minX &&
        region1.minY < region2.maxY &&
        region1.maxY > region2.minY) {
         return true
    }
    return false
}

function draw_frame_data(frame_data,target_ctx,x,y){
    let {minX, minY, maxX, maxY} = frame_data.source_bounds
    let {sheet_id} = frame_data
    let width = Math.floor(maxX-minX)
    let height = Math.floor(maxY-minY)
    let source_sheet_object = project_memory_manager.GetInputSheetById(sheet_id)
    let source_canvas = source_sheet_object.canvas
    target_ctx.drawImage(source_canvas,minX,minY,width,height,Math.floor(x),Math.floor(y),width,height)
}