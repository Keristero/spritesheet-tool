class QuickPointSelect extends CanvasContainer{
    constructor(click_callback){
        super("unimportant_id")
        this.ResizeCanvas(150,150)
        this.Draw()
        this.button_tab_title.textContent = "Quick point selection"
        this.click_callback = click_callback
    }
    Draw(){
        console.log('draw')
        this.ctx.strokestyle = 'black'
        for(let x = 0; x < 3; x++){
            for(let y = 0; y < 3; y++){
                this.ctx.strokeRect(x*50,y*50,50,50)
            }
        }
    }
    MouseClick(e){
        if(e.button === 0){
            let x_regions = 3
            let y_regions = 3
            for(let x = 0; x < x_regions; x++){
                for(let y = 0; y < y_regions; y++){
                    let sx = x*50
                    let ex = (x+1)*50
                    let sy = y*50
                    let ey = (y+1)*50
                    this.ctx.strokeRect(x*50,y*50,50,50)
                    if(this.hover_pos.x > sx && this.hover_pos.x < ex && this.hover_pos.y > sy && this.hover_pos.y < ey){
                        console.log(x,y)
                        this.click_callback(x/(x_regions-1),y/(y_regions-1))
                    }
                }
            }
        }
    }
}