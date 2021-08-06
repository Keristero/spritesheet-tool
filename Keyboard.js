class Keyboard{
    constructor(){
        this.keys = {}
        document.addEventListener('keydown',(e)=>{
            this.keys[e.code] = true
        })
        document.addEventListener('keyup',(e)=>{
            this.keys[e.code] = false
        })
    }
    KeyIsHeld(key_code){
        if(this.keys[key_code]){
            return true
        }
        return false
    }
    CtrlIsHeld(){
        if(this.KeyIsHeld("ControlLeft") || this.KeyIsHeld("ControlRight")){
            return true
        }
        return false
    }
}