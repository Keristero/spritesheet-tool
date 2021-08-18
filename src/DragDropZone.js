class DragDropZone {
    constructor() {
        this.PrepareHTML();
        this.default_color = "rgba(0,0,50,0)";
        this.bad_color = "rgba(255,0,0,0.1)";
    }
    PrepareHTML() {
        this.element = document.createElement("div");
        this.element.ondrop = (e) => {
            this.Drop(e);
        };
        this.element.ondragover = (e) => {
            this.DragOver(e);
        };
        this.element.ondragenter = (e) => {
            this.DragEnter(e);
        };
        this.element.ondragleave = (e) => {
            this.DragLeave(e);
        };
        this.element.classList.add("dropzone");
        this.element.textContent = `Drag and drop or paste spritesheet images here from your filesystem`
    }
    DragOver(event) {
        event.preventDefault();
    }
    DragEnter(event) {
        event.dataTransfer.dropEffect = "copy";
        console.log(event.dataTransfer.types);
        if (event.dataTransfer.types.includes("Files")) {
            this.element.style.backgroundColor = "rgba(0,100,0,0.1)";
        } else {
            this.element.style.backgroundColor = this.bad_color;
        }
    }
    DragLeave(event) {
        event.dataTransfer.dropEffect = "copy";
        console.log(event.dataTransfer.types);
        this.element.style.backgroundColor = this.default_color;
    }
    Drop(event) {
        event.preventDefault();
        this.element.style.backgroundColor = this.default_color;
        let images = [];
        for (let item of event.dataTransfer.items) {
            console.log('item',item)
            if (item.kind === "file") {
                let file = item.getAsFile();
                images.push(file)
            }
        }
        process_input_images(images)
    }
    
}
