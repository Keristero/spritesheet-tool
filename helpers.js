function create_and_append_element(element_tag,parent){
    let new_element = document.createElement(element_tag)
    parent.appendChild(new_element)
    return new_element
}

function sleep(milliseconds){
    return new Promise((reoslve)=>{
        setTimeout(reoslve,milliseconds)
    })
}