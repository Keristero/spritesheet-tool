class ProjectMemoryManager{
    constructor(){
        this.is_project_loaded = false
        this.TryLoadProject()
        this.CreateElements()

        this.input_sheet_objects = {}
        this.animation_state_objects = {}
    }
    CreateElements(){
        let div_settings = document.getElementById('settings')
        this.element = create_and_append_element('div',div_settings)

        //Create project button
        let btn_new_project = create_and_append_element('button',this.element)
        btn_new_project.textContent = "New Project"
        btn_new_project.onclick = ()=>{
            if(window.confirm("This will overwrite your existing project, are you sure?")){
                this.NewProject()
                this.SaveProject()
            }
        }

        //Input that handles files being uploaded for loading the project
        let inp_load_project = create_and_append_element('input',this.element)
        inp_load_project.type = 'file'
        inp_load_project.style.display = "none"
        inp_load_project.addEventListener("change", ()=>{
            console.log(inp_load_project.files)
            try{
                let fileReader = new FileReader();
                fileReader.onload = (fileLoadedEvent)=>{
                    let loaded_text = fileLoadedEvent.currentTarget.result;
                    this.LoadProject(loaded_text)
                };
                fileReader.readAsText(inp_load_project.files[0], "UTF-8");
            }catch(e){
                alert(`Error uploading file`)
            }
        }, false);

        //Button to prompt user for project json upload
        let btn_load_project = create_and_append_element('button',this.element)
        btn_load_project.textContent = "Load Project"
        btn_load_project.onclick = ()=>{
            inp_load_project.click();
        }

        //Input that handles files being uploaded for loading the project
        let p_load_project = create_and_append_element('p',this.element)
        p_load_project.textContent = "Project Name"
        let inp_project_name = create_and_append_element('input',p_load_project)
        inp_project_name.type = 'text'
        inp_project_name.addEventListener("change", ()=>{
        }, false);
        

        //Save project to file button
        let btn_save = create_and_append_element('button',this.element)
        btn_save.textContent = "Save Project"
        btn_save.onclick = ()=>{
            this.SaveProject(this.GetProjectFilename())
        }

    }
    TryLoadProject(){
        let storage_api_project = localStorage.getItem('project')
        if(storage_api_project){
            this.LoadProject(storage_api_project)
        }else{
            this.NewProject()
            this.SaveProject()
        }
    }
    NewProject(project_name){
        this.memory = {
            name:project_name ?? this.GetDefaultProjectName(),
            next_input_sheet_id: 0,
            next_animation_state_id:0,
            selected_animation_state_id:null,
            animation_states:{},
            input_sheets:{}
        }
        this.is_project_loaded = true
    }
    GetProjectFilename(){
        return `${this.memory.name}.json`
    }
    GetDefaultProjectName(){
        return `ezsheets-${this.GetDateString()}`.replace(/([^a-zA-Z0-9_-])/gi,"-")
    }
    GetDateString(){
        let date = new Date()
        return date.toLocaleString()
    }
    RemoveExistingElements(){
        for(let sheet_id in this.input_sheet_objects){
            let sheet_object = this.input_sheet_objects[sheet_id]
            sheet_object.DeleteSelf()
        }
        this.input_sheet_objects = {}
        for(let state_id in this.animation_state_objects){
            let state_object = this.animation_state_objects[sheet_id]
            state_object.DeleteSelf()
        }
        this.animation_state_objects = {}
    }
    LoadProject(project_json){
        //Load project json
        try{
            let project_memory = JSON.parse(project_json)
            if(project_memory){
                this.memory = project_memory
                console.log('loaded project',this.memory)
                this.is_project_loaded = true
            }
        }catch(e){
            alert('tried loading invalid json')
        }

        //Remove all existing sheets
        this.RemoveExistingElements()

        //Instantiate objects for each input sheet
        for(let sheet_id in this.memory.input_sheets){
            let sheet_data = this.memory.input_sheets[sheet_id]
            if(sheet_data.id == undefined){
                continue
            }
            this.PrepareInputSheet(sheet_data)
        }

        //Instantiate objects for each animation state
        for(let state_id in this.memory.animation_states){
            let state_data = this.memory.animation_states[sheet_id]
            if(state_data.id == undefined){
                continue
            }
            this.PrepareAnimationState(state_data)
        }

    }
    SaveProject(to_file){
        if(!this.is_project_loaded){
            console.error(`cant save a project when none is loaded`)
            return
        }
        let project_json_string = JSON.stringify(this.memory)
        localStorage.setItem('project',project_json_string)
        if(to_file){
            download_json_file(this.GetProjectFilename(),project_json_string)
        }
    }
    NewInputSheet(image){
        let url = window.URL || window.webkitURL;
        let image_data_url = url.createObjectURL(image);
        let image_name = image.name

        let initial_data = {
            id:this.memory.next_input_sheet_id,
            image_name,
            image_url:image_data_url
        }

        this.memory.input_sheets[initial_data.id] = initial_data
        this.PrepareInputSheet(initial_data)
        this.memory.next_input_sheet_id++
    }
    NewAnimationState(){
        let initial_data = {
            id:this.memory.next_animation_state_id
        }
        this.memory.animation_states[initial_data.id] = initial_data
        let new_animation_state = this.PrepareAnimationState(initial_data)
        this.SelectAnimationState(new_animation_state.id)
        this.memory.next_animation_state_id++
    }
    PrepareInputSheet(sheet_data){
        //instantiate an input sheet as a source of animation frames
        let input_sheet = new InputCanvasContainer(sheet_data)
        this.input_sheet_objects[sheet_data.id] = input_sheet

        //Append the element to the page
        input_zone.appendChild(input_sheet.element);
        //Add deletion callback
        input_sheet.onDelete = () => {
            input_zone.removeChild(input_sheet.element);
            delete this.input_sheet_objects[input_sheet.id]
            delete this.memory.input_sheets[input_sheet.id]
        };

        return input_sheet
    }
    PrepareAnimationState(state_data){
        //instantiate an animation state
        let animation_state = new AnimationCanvasContainer(state_data)
        this.animation_state_objects[state_data.id] = animation_state

        //Append the element to the page
        states_zone.appendChild(animation_state.element);
        //Add deletion callback
        animation_state.onDelete = () => {
            states_zone.removeChild(animation_state.element);
            delete this.animation_state_objects[animation_state.id]
            delete this.memory.animation_states[animation_state.id]
            this.SelectAnimationState(null)
        };

        //Add selection callback
        animation_state.element.onclick = ()=>{
            this.SelectAnimationState(animation_state.id)
        }
        
        return animation_state
    }
    SelectAnimationState(animation_state_id) {
        console.log('Selected animation state',animation_state_id)
        for (let state_id in this.animation_state_objects) {
            let animation_state = this.animation_state_objects[state_id]
            animation_state.Deselect();
            if(state_id === animation_state_id){
                animation_state.Select();
                this.memory.selected_animation_state_id = animation_state_id;
            }
        }
    }
    AddFrameToSelectedState(source_image,source_bounds,anchor_pos) {
        if (this.memory.selected_animation_state_id === null) {
            return;
        }
        let selected_animation_state = this.animation_state_objects[this.memory.selected_animation_state_id]
        selected_animation_state.AddFrame(source_image,source_bounds,anchor_pos)
    }
}

const project_memory_manager = new ProjectMemoryManager()
