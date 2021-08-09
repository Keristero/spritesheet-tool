class ProjectMemoryManager{
    constructor(){
        this.project_loaded = false
        this.TryLoadProject()
        this.CreateElements()
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
                    let loaded_text = fileLoadedEvent.target.result;
                    console.log('loading',JSON.stringify(loaded_text))
                    //try{
                        let project_json = JSON.parse(loaded_text)
                        this.LoadProject(project_json)
                    //}catch(e){
                        alert(`Invalid json`)
                    //}
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
            name:project_name ?? this.GetDefaultProjectName()
        }
        this.project_loaded = true
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
    LoadProject(project_json){
        let project_memory = JSON.parse(project_json)
        if(project_memory){
            this.memory = project_memory
            console.log('loaded project',this.memory)
            this.project_loaded = true
        }
    }
    SaveProject(to_file){
        if(!this.project_loaded){
            console.error(`cant save a project when none is loaded`)
            return
        }
        let project_json_string = JSON.stringify(this.memory)
        localStorage.setItem('project',project_json_string)
        if(to_file){
            download_json_file(this.GetProjectFilename(),project_json_string)
        }
    }
}

const project_memory_manager = new ProjectMemoryManager()
