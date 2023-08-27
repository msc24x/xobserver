import { XObserver } from "../dist/index.js"

function init() {
    const elems = document.getElementsByClassName("elem")
    
    for (let elem of elems) {
        XObserver.ping("ab", { threshold: 0 })
        XObserver.subscribe("ab", elem, (entry) => {
                if(entry.isIntersecting)
                    entry.target.classList.add("vis")
                else
                    entry.target.classList.remove("vis")
                    
            })
    }
}

document.addEventListener("DOMContentLoaded", () => {
        
    const container = document.getElementById("container")
    
    
    for (let  i = 1; i < 1000; i++){
        const elem = document.createElement("div")
        elem.className = "elem"
        elem.id = i
        container.appendChild(elem)
            
    }

    const initButton = document.getElementById("init")
    initButton.onclick =init
    

    
})

