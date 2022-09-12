color_obj = {
    yellow: "rgb(255, 255, 0)",
    blue: "rgb(0, 0, 255)",
    red: "rgb(255, 0, 0)",
    green: "rgb(0, 128, 0)",
    orange: "rgb(255, 165, 0)",
    white: "rgb(255, 255, 255)"
}
for(var i = 0; i < 9; i++){
    var color_class = document.getElementsByClassName("colors")[i]
    color_class.value = "none"
}
function loadColor(obj){
    var color_code = String(obj.value)
    var dot = document.getElementsByClassName("dot")[obj.id[5]]
    dot.style.backgroundColor = color_obj[color_code]
}