Wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
var Local = []

let lang = "DE"

function _U(local) {
    try{return Local[lang][local]}
    catch(err){
        console.log(err)
    }
}