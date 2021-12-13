function create_and_append_element(element_tag,parent){
    let new_element = document.createElement(element_tag)
    parent.appendChild(new_element)
    return new_element
}

function create_and_append_checkbox_with_label(label_text,parent){
    let chk_box = create_and_append_element('input',parent)
    chk_box.type = "checkbox"
    let label_box = create_and_append_element('label',parent)
    label_box.textContent = label_text
    return chk_box
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

function round_to_decimal_points(num,x) {
    return +(Math.round(num + `e+${x}`)  + `e-${x}`);
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

function draw_frame_data(frame_data,target_ctx,x,y,t_width,t_height){
    let {minX, minY, maxX, maxY} = frame_data.source_bounds
    let {sheet_id} = frame_data
    let width = Math.floor(maxX-minX)
    let height = Math.floor(maxY-minY)
    let target_width = t_width ?? width
    let target_height = t_height ?? height
    let source_sheet_object = project_memory_manager.GetInputSheetById(sheet_id)
    let source_canvas = source_sheet_object.image_buffer_canvas
    target_ctx.drawImage(source_canvas,minX,minY,width,height,Math.floor(x),Math.floor(y),target_width,target_height)
    //let ctx_image_data = target_ctx.getImageData(Math.floor(x), Math.floor(y), target_width,target_height)
    //let modified_image_data = removeColor(ctx_image_data,source_sheet_object.transparent_color,target_ctx)
    //target_ctx.putImageData(modified_image_data, Math.floor(x), Math.floor(y));
}

function removeColor(ctx_image_data,color){
    console.log('removed transparent color')
    let pix = ctx_image_data.data;
    for (var i = 0, n = pix.length; i <n; i += 4) {
        if(pix[i] === color[0] && pix[i+1] === color[1] && pix[i+2] === color[2] && pix[i+3] === color[3]){
            pix[i+3] = 0
            pix[i+2] = 0
            pix[i+1] = 0
            pix[i] = 0
        }
    }
    return ctx_image_data
}

function swap_array_elements_left(array,indexes){
    /* accepts an object with indexes as keys, will shift each of those indexes in the array one to the left if it can 
    let somearr = ["apple","banana","cola","sushi","mountain dew"]
    let selected_indexes = {0:true,3:true,4:true}
    swap_array_elements_left(somearr,selected_indexes)
    console.log(somearr) // [ 'apple', 'banana', 'sushi', 'mountain dew', 'cola' ]
    */
    for(let i = 1; i < array.length; i++){
        if(indexes[i] && !indexes[i-1]){
            let left_element = array[i-1]
            array[i-1] = array.splice(i,1,left_element)[0]
            delete indexes[i]
            indexes[i-1] = true
        }
    }
}

function swap_array_elements_right(array,indexes){
    /* accepts an object with indexes as keys, will shift each of those indexes in the array one to the right if it can */
    for(let i = array.length-2; i >= 0; i--){
        if(indexes[i] && !indexes[i+1]){
            let left_element = array[i]
            array[i] = array.splice(i+1,1,left_element)[0]
            delete indexes[i]
            indexes[i+1] = true
        }
    }
}

function hexToRgbA(hex,alpha){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        rgb = [(c>>16)&255, (c>>8)&255, c&255].join(',')
        return `rgba(${rgb},${alpha})`;
    }
    throw new Error('Bad Hex');
}