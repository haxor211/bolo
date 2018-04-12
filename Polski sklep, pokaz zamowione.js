var a = document.getElementById('sales_order_grid_table');
var arr = [];
var total = 0;

function count() {
    for (var i = 0; i < a.children[2].childElementCount; i++) {
        if (a.children[2].children[i].children[9].innerText != 'Anulowane') {
            arr.push(a.children[2].children[i].children[8].innerText);
        }
    }
}

function clear() {
    for (var k = 0; k < arr.length; k++) {
        arr[k] = arr[k].replace(/zł/g, '');
        arr[k] = arr[k].replace(/,/, '.');
        arr[k] = arr[k].replace(/\s/g, '');
    }
}

function sum() {
    for (var j = 0; j < arr.length; j++) {
        total = parseFloat(arr[j]) + total;
    }
}

count();
clear();
sum();
alert(total);