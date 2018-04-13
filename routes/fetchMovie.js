var b = $('.bottom');
var c = $('.darmowy');
var fetch = '';
var tytul = '';
var url = '';
var link = '';
var dzejson = {
    title: [],
    seeds: [],
    url: []
};
var arr = [];

function json(title, seed, url) {
    this.title = title;
    this.seed = seed;
    this.url = url;
}

function toJson() {
    dzejson = arr;
}

for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 6; j++) {
        if (
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/3D' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/4K UHD' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/BRRip' ||	
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/Animowane' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/BDRip' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/CAM-TC-TS' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/Dokumentalne' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/DVD' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/HD' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/Kino Polskie' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/PACK' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/WEB-DL' ||
            b[4].children[0].children[i].children[j].children[1].innerText == 'Filmy/SD') {
            b[4].children[0].children[i].children[j].children[0].checked = true;
        }
    }
}

for (var k = 0; k < 15; k++) {
    console.log(k);
    fetch = c[k].children[6].innerText.split('/');
    link = c[k].children[1].children[1].href;
    tytul = c[k].children[1].children[1].innerText;
    if(fetch[0] > 35) {
        //dzejson.title.push(tytul);
        //dzejson.seeds.push(fetch[0]);
        var newJson = new json(tytul, fetch[0], link);
        arr.push(newJson);
        url = c[k].children[6].children[0].children[0].href
        //window.open(url, '_blank', 'PopUp', Math.floor((Math.random()*100)+1), 'scrollbars=1,menubar=0,resizable=1,width=850,height=500');
    } url = '';
}

toJson();

for (var l = 0; l < dzejson.length; l++) {
    window.open(dzejson[l].url, '_blank');
}
