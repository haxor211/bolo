function test(e) {
    var x = e.clientX;
    var y = e.clientY;
    
    var maxScale = 2;
    
    var transX = (x/100) - 2;
    
    var transY = (y/100) - 2;
    
    
    a.setAttribute('style', 'transform: scale(' + 2 + ')');
    // debug
    console.log('x = ' + transX);
    console.log('y = ' + transY);
}

function def() {
    a.setAttribute('style', 'transform: scale(' + 1 + ')');
}



var a = document.getElementById('image');
function enter() {
    a.setAttribute('style', 'transition: transform 0.5s ease-in-out; transform: scale(1.5)');
}

function leave() {
    a.setAttribute('style', 'transition: transform 0.5s ease-in-out; transform: scale(1)');
}
a.addEventListener('mouseenter', enter);
a.addEventListener('mouseleave', leave);