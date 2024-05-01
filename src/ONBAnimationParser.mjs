let default_point_colors = ['rgba(0,255,0,0.5)','rgba(0,0,255,0.5)','rgba(255,255,0,0.5)','rgba(255,0,255,0.5)','rgba(128,0,0,0.5)','rgba(0,128,0,0.5)','rgba(0,0,128,0.5)','rgba(128,0,128,0.5)','rgba(128,128,0,0.5)','rgba(128,128,128,0.5)','rgba(50,50,50,0.5)','rgba(255,128,0,0.5)','rgba(50,128,255,0.5)']
let unique_custom_point_count = 0

function ParseONBAnimation(animation_txt){
    let lines = animation_txt.split(`\n`)
    let project = {
        name:'imported project',
        next_input_sheet_id:1,
        next_animation_state_id:0,
        selected_animation_state_id:0,
        animation_states:{},
        custom_points:{},
        input_sheets:{"0":{"id":0,"image_name":"replace_me.png","image_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAAA8CAMAAACQA+KNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAAAkJCR8fHwYGBhYWFv///+rq6qioqAAAAMUEFOAAAAAJdFJOU///////////AFNPeBIAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACISURBVGhD7dYxDoMwEAVRME7w/U8cJDySpTVyXIAo5rV/iyl3KS9gBIyAEXhZxNJX1/E+Prg0EbGmaG0jthxtsxGfqI1I3yi1EXmPshGVETACRsAIGAEjYASMwHREV12P/Zkfs6uu4318cOmfm9sZASNgBIyAETACRsAIGAEjYASMgBEw4lTKDx9v4SMUImdJAAAAAElFTkSuQmCC"}}
    }

    //arrgh, brain hurt oof
    let regx_imagepath = /imagePath="(?<image_path>.*)"/i
    let regx_state = /animation state="(?<state>.*)"/i
    let regx_frame = /frame duration="(?<duration>.*)" x="(?<x>.*)" y="(?<y>.*)" w="(?<w>.*)" h="(?<h>.*)" originx="(?<anchorx>.*)" originy="(?<anchory>\d*)"(( flipx="(?<flipx>\d*)")( flipy="(?<flipy>.*)")?)?/i
    let regx_point = /point label="(?<label>.*)" x="(?<x>.*)" y="(?<y>.*)"/i

    let linetypes = [{label:"frame",regex:regx_frame},{label:"point",regex:regx_point},{label:"state",regex:regx_state},{label:"image_path",regex:regx_imagepath}]
    let current_animation_state = null
    let current_frame
    for(let line of lines){
        let result = ParseLine(line,linetypes)
        if(result?.label === "state"){
            new_animation_state(project,result.data)
            current_animation_state = project.animation_states[project.next_animation_state_id-1]
        }
        if(result?.label === "frame"){
            new_frame(current_animation_state,result.data)
            current_frame = current_animation_state.frames[current_animation_state.frames.length-1]
        }
        if(result?.label === "point"){
            new_point(project,current_frame,result.data)
        }
        if(result?.label === "image_path"){
            project.name == result.data.image_path
        }
        
    }
    let json = JSON.stringify(project)
    //console.log(json)
    return json
}
function new_point(project,frame,{label,x,y}){
    //console.log(label)
    if(!project.custom_points[label]){
        project.custom_points[label] = default_point_colors[unique_custom_point_count++]
    }
    frame.custom_points[label] = {x:frame.source_bounds.minX+parseInt(x),y:frame.source_bounds.minY+parseInt(y)}
}

function new_frame(animation_state,{duration,x,y,w,h,anchorx,anchory,flipx,flipy}){
    let global_x = parseInt(x)
    let global_y = parseInt(y)
    let width = parseInt(w)
    let height = parseInt(h)
    let anchor_x = parseInt(anchorx)
    let anchor_y = parseInt(anchory)
    animation_state.frames.push({
        sheet_id: 0,
        source_bounds: {
            "minX": global_x,
            "minY": global_y,
            "maxX": global_x+width,
            "maxY": global_y+height
        },
        anchor_pos: {
            "x": global_x+anchor_x,
            "y": global_y+anchor_y
        },
        "duration": parseFloat(duration)*1000,
        "flip_x": flipx? true : false,
        "flip_y": flipy? true : false,
        "custom_points":{}
    })
}

function new_animation_state(project,{state}){
    let new_id = project.next_animation_state_id++
    let animation_state = {
        "default_props": {
            "duration": 100,
            "flip_x": false,
            "flip_y": false,
            "anchor_x": 0,
            "anchor_y": 0
        },
        id:new_id,
        state_name:state,
        frames:[],
        clone_states: [],
        collapsed: true
    }
    project.animation_states[new_id] = animation_state
}
function ParseLine(line, linetypes){
    for(let type of linetypes){
        let result = ParseLineData(line,type.regex,type.label)
        if(result){
            return result
        }
    }
}
function ParseLineData(line,regex,type_label){
    let match = regex.exec(line)
    if(match){
        return {label:type_label,data:match.groups}
    }
    return null
}

export default ParseONBAnimation