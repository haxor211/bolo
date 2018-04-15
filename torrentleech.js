var randomnumber = Math.floor((Math.random() * 100) + 1);
var a = $('.bottom')[4].children[0]
var b = $('.darmowy');
var url = '';
var tytul = '';
var seed = '';
var arr = [];

function movie(title, seed, url) {
    this.title = title;
    this.seed = seed;
    this.url = url;
}

function markMovies() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 5; j++) {
            console.log('i: ' + i);
            console.log('j: ' + j);
            var zaznacz = a.children[i].children[j].innerText;
            if (zaznacz == 'Filmy/3D' ||
                zaznacz == 'Filmy/4K UHD' ||
                zaznacz == 'Filmy/Animowane' ||
                zaznacz == 'Filmy/BDRip' ||
                zaznacz == 'Filmy/CAM-TC-TS' ||
                zaznacz == 'Filmy/Dokumentalne	' ||
                zaznacz == 'Filmy/DVD' ||
                zaznacz == 'Filmy/HD' ||
                zaznacz == 'Filmy/Kino Polskie' ||
                zaznacz == 'Filmy/PACK' ||
                zaznacz == 'Filmy/SD' ||
                zaznacz == 'Filmy/WEB-DL'
            ) {
                a.children[i].children[j].children[0].checked = true;
            }
        }
    }
}

markMovies();

    for (var i = 0; i < b.length; i++) {
        url = b[i].children[1].children[1].href;
        tytul = b[i].children[1].children[1].innerText;
        seed = b[i].children[6].children[0].innerText;
        if(seed > 25) {
            if(tytul == undefined || url == undefined) {
                url = b[i].children[1].children[2].href;
                tytul = b[i].children[1].children[2].innerText;
            }
            arr.push(new movie(tytul, seed, url));
        }
    }
//window.open('yoururl',"_blank",'PopUp'+randomnumber+',scrollbars=1,menubar=0,resizable=1,width=850,height=500');

var http = new XMLHttpRequest();
var url = "http://localhost:8080/";
var params = JSON.stringify(arr);
http.open("POST", url, true);

//Send the proper header information along with the request
http.setRequestHeader("Content-type", "application/json");

http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        console.log(http.responseText);
    }
}
http.send(params);

/*
$.ajax({
	url: 'http://localhost:3000/',
	type: 'POST',
data: {
	myArr : arr
},
	success: function(msg) {
	alert(msg);
},
    contentType: 'application/x-www-form-urlencoded'
	//contentType: 'application/json',
});
*/

