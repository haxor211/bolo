function createEle(element, nazwa, atrybut, atrybutPlaceholder, dodajDo, innerText) {
    // Variables
    var addTo = document.getElementById(dodajDo);
    this.element = document.createElement(element);
    var to = this.element;
    // Set Attributes
    console.log(to);
    to.setAttribute(atrybut, atrybutPlaceholder);
    if (nazwa != null) to.setAttribute('id', nazwa);
    if (element == 'INPUT') to.setAttribute('type', 'text');
    if (innerText != null) to.innerText = innerText;
    // Append
    if (dodajDo != null) addTo.appendChild(to);
    console.log('Created');
    return this.element;
};

if (window.location.href == "https://ac5.webcomcpq.com/quotation/DisplayBulkValidate.aspx?format=1" | window.location.href == "https://ac5.webcomcpq.com/quotation/DisplayBulkValidate.aspx?format=2") {
    //var discount = document.createElement('INPUT');
    //discount.setAttribute('style', 'width: 15px; height:auto; position: relative; left: 10px');
    //discount.setAttribute('type', 'text');
    var tab = document.getElementsByClassName('displayBulkValidateTable')[0].getElementsByTagName('tr')
    var b = document.getElementById('ctl00_MainContentPlaceHolder_upMain');
    var sel = document.createElement('select');
    b.append(sel);
    sel.options.add(new Option('USD'));
    sel.options.add(new Option('EUR'));
    send('USD');
    sel.addEventListener("change", function () {
        send(this.options[this.selectedIndex].value); // Wybieranie Waluty
    })


    var glownyHeader = 'ctl00_MainContentPlaceHolder_upMain';
    var discount = new createEle('INPUT', null, 'style', 'Width: 15px; height:auto; position: relative; left: 10px');
        img = new createEle('img', null, 'style', 'height: 25px; width: 25px;');
        img.src = chrome.runtime.getURL('button.png');
        button = new createEle('a', 'export', 'style', 'height: 30px; width: 50px; position: relative; left: 10px; top:10px', glownyHeader);
        button.setAttribute('download', 'cennik.csv');
        button.appendChild(img);
        pokazKurs = new createEle('INPUT', null, 'style', 'width: 50px; position: relative; right: 150px', glownyHeader);
        pokazKurs.setAttribute('readonly', 'true');
        suma = new createEle('div', null, 'style', 'border-style: groove; width: fit-content; position: relative; right: 113px; top:15px; height:15px', glownyHeader, 0);
        textSuma = new createEle('INPUT', null, 'style', 'border: groove; width: 50px; position: relative; right: 240px; top: 38px;', glownyHeader);
        textSuma.setAttribute('readonly', 'true');
        textSuma.value = 'Suma: ';
        pdfButtImg = new createEle('img', null, 'style', 'width: 85px; height: auto; position:relative; left: 165px; top: -80px;', glownyHeader);
        pdfButtImg.src = 'https://extension.usu.edu/boxelder/images/PDF.png'
        pdfCreator = new createEle('script', null, 'id', 'pdfScript', glownyHeader);
        pdfCreator.src = chrome.runtime.getURL('jspdf.debug.js');
        //glownyHeader.append(pdfCreator);
        //    var button = document.createElement('a');
    //var pdfButtImg = document.createElement('img');
    //var pdfCreator = document.createElement('script')

    //pdfButtImg.setAttribute('style', 'width: 85px; height: auto; position:relative; left: 165px; top: -80px;')
    //b.appendChild(pdfButtImg);
    //var img = document.createElement('img');
    //img.setAttribute('style', 'height: 25px; width: 25px;');
    //button.setAttribute('id', 'export');
    //button.setAttribute('download', 'cennik.csv');
    //button.setAttribute('style', 'height: 30px; width: 50px; position: relative; left: 10px; top:10px');
    //b.appendChild(button);

    //var pokazKurs = document.createElement('input');
    //pokazKurs.setAttribute('style', 'width: 50px; position: relative; right: 150px');
    //b.append(pokazKurs);

    //var suma = document.createElement('div');
    //var textSuma = document.createElement('input');
    var sumaTablica = [];
    //b.appendChild(textSuma);
    //b.appendChild(suma);
    //textSuma.setAttribute('readonly', 'true');
    //textSuma.value = 'Suma: ';
    //textSuma.setAttribute('style', 'border: groove; width: 50px; position: relative; right: 240px; top: 38px;');
    //suma.setAttribute('style', 'border-style: groove; width: fit-content; position: relative; right: 113px; top:15px; height:15px');
    //suma.innerText = 0;

    function razem() {
        suma.innerText = 0;
        sumaTablica = [];
        for (var i = 1; i < tab.length; i++) {
            if (tab[i].children[2] != undefined) {
                sumaTablica.push(tab[i].children[2].innerText.split(' '));
            }
        }
        for (var k = 0; k <= sumaTablica.length; k++) {
            if (tab[k].children[3] != undefined && tab[k].children[3].children[0] != undefined && tab[k].children[3].children[0].value > 1) {
                console.log('ile jest k ' + k);
                console.log(sumaTablica[k - 1][4] * tab[k].children[3].children[0].value);
                sumaTablica[k - 1][4] = sumaTablica[k - 1][4] * tab[k].children[3].children[0].value;
            }
        }
        for (var q = 0; q < sumaTablica.length; q++) {
            var dodaj = parseFloat(sumaTablica[q][4]);
            suma.innerText = Math.round((parseFloat(suma.innerText) + dodaj) * 100) / 100;
        }
    }

    function addEvents() {
        for (var i = 1; i < tab.length; i++) {
            if (tab[i].children[2] != undefined) {
                tab[i].children[2].addEventListener('change', razem);
                tab[i].children[3].children[0].addEventListener('change', razem);
            }
        }
    }

    function generate() {
        var numery = [['Part Number;Currency;Price']];
        for (var i = 1; i < tab.length; i++) {
            if (tab[i].children[2] != undefined) {
                var o = tab[i].children[2].innerText.split(' ')
                numery.push([tab[i].children[0].innerHTML, o[3] + ';' + o[4]].join(';').replace('.', ','));
            }
        }
        document.getElementById('export').setAttribute('href', 'data:text/plain,' + encodeURIComponent(numery.join("\n")));
        return numery;
    }

    function convert(waluta, j) {
        for (var i = 1; i < tab.length; i++) {
            if (tab[i].children[2] != undefined) {
                tab[i].children[2].innerText = tab[i].children[2].innerText.replace(',', '');
                var show = tab[i].children[2].innerText;
                var test = tab[i].children[2].innerText.split(' ');
                var k = parseFloat(show.substring(3).replace(',', '')) / j.rates[0].bid;
                pokazKurs.value = j.rates[0].bid;
                console.log('Kurs ' + waluta + ' ' + j.rates[0].bid);
                tab[i].children[2].innerText = test[0] + ' ' + test[1] + ' / ' + waluta + ' ' + Math.round(k * 100) / 100;
                generate();
                var newDiscount = discount.cloneNode();
                tab[i].children[2].appendChild(newDiscount);
                tab[i].children[2].lastChild.addEventListener("change", function () {
                    i = i - 1;
                    var d = 1;
                    if (!isNaN(parseInt(this.value))) {
                        d = (100 - parseInt(this.value)) / 100;
                    }
                    var staraCena = this.previousSibling.wholeText.split(' ');
                    var ob = staraCena[1] / j.rates[0].bid;
                    var cenaDiscount = Math.round(parseFloat(ob) * d * 100) / 100;
                    staraCena[4] = cenaDiscount + '';
                    this.previousSibling.replaceData(0, 400, staraCena.join(' '));
                    generate();
                });
            }
        }
    }

    function send(waluta) {
        var a = new XMLHttpRequest();
        a.open('GET', 'https://api.nbp.pl/api/exchangerates/rates/c/' + waluta + '/today?format=json');
        a.addEventListener('load', function () {
            convert(waluta, JSON.parse(this.responseText));
            addEvents();
            razem();
        });
        a.send();
    };
    //Pdf Creator
    var pdfArr = [];
    var pdf = '';
    var newArr = [];
    //var pdfButtImg = document.createElement('img');
    //var pdfCreator = document.createElement('script')

    //pdfButtImg.src = 'https://extension.usu.edu/boxelder/images/PDF.png'
    //pdfButtImg.setAttribute('style', 'width: 85px; height: auto; position:relative; left: 165px; top: -80px;')
    //pdfCreator.src = chrome.runtime.getURL('jspdf.debug.js');
    //b.appendChild(pdfButtImg);
    //b.append(pdfCreator);

    setTimeout(function () {
        console.log('pdfArr stworzone');
        for (var i = 1; i < tab.length; i++) {
            newArr.push(tab[i].innerText.match(/\d+/));
            var match = tab[i].innerText.match(/USD\s\d+\.?\d+?\d+?/)
            if (tab[i].innerText.match(/USD\s\d+\.?\d+?\d+?/) != null) {
                newArr[i - 1].push(match[0]);
                pdfArr = newArr.join('\n');
                pdfArr = pdfArr.replace(/,/g, ' ');
                function createPDF() {
                    pdf = new jsPDF();
                    pdf.setFontSize('12');
                    pdf.text(pdfArr, 5, 5);
                    pdf.save('E-Pneumatic-Offer.pdf');
                }
            } else {
                newArr[i - 1].push('Product not found - wrong Atlas Copco number');
            }
        } pdfButtImg.addEventListener('click', createPDF);
    }, 1000);
}
/////////////////////////// Regexp
if (window.location.href == "https://ac5.webcomcpq.com/quotation/BulkValidation.aspx") {
    var a = 'divBulkValidation'
    var aa = document.getElementById(a);
    var test = aa.children[1].children[0].children[1].children[0].children[0];
    var tabSpace = test.value.split('\n');
    
    var regButton = new createEle('button', 'regButton', 'style', 'border: solid; height: 20px; width: 35px; position: relative; left: 0px; top:-23px; padding: 0px; padding-bottom: 20px; padding-right: 35px;', a);
        regImg = new createEle('img', null, 'style', 'width: 35px; height: 20px;')
        removeLeftNumbers = new createEle('button', null, 'style', 'border: solid; height: 26px;width: auto;position: relative;left: -180px; top: -29px;', a)
        removeLeftNumbersImg = new createEle('img');
        removeLeftNumbers.addEventListener('click', removeLeftNum)
        removeLeftNumbers.textContent = 'Usun Wszystkie <9';
        regImg.src = 'https://ichef.bbci.co.uk/news/660/cpsprodpb/1617C/production/_85829409_nuke_cut.jpg';
        regButton.appendChild(regImg);
        regButton.addEventListener('click', acNumbers);

    //var regButton = document.createElement('button');
    //var regImg = document.createElement('img');
    //var removeLeftNumbers = document.createElement('button');
    //var removeLeftNumbersImg = document.createElement('img');

    //regImg.setAttribute('style', 'width: 35px; height: 20px;')

    //regButton.setAttribute('style', 'border: solid; height: 20px; width: 35px; position: relative; left: 0px; top:-23px; padding: 0px; padding-bottom: 20px; padding-right: 35px;');
    //regButton.setAttribute('id', 'regButton');

    //removeLeftNumbers.setAttribute('style', 'border: solid; height: 26px;width: auto;position: relative;left: -180px; top: -29px;');

    //a.appendChild(regButton);
    //a.appendChild(removeLeftNumbers);

    var reg = '';
    var regTablica = [];
    var regNull = '';
    var pnTab = [];
    var pnMatch = '';
    var regTablicaClean = [];

    test.addEventListener('change', function () {
        tabSpace = test.value.split('\n');
        console.log(tabSpace);
    })

    function fetchpn() {
        var user = prompt('Szukac po PN czy po wszystkim? Wpisz "tak" jezeli po PN', 'tak lub nie')
        if (user == 'tak') {
            for (var i = 0; i < tabSpace.length; i++) {
                var qwe = tabSpace[i].match(/PN.*?\s?\W?\s?(\d+\s?\d+\s?\d+)|PN.*?(\d+)|Parts.?\w+?\s?\s?(\d+\s?\d+\s?\d+)|P.?N\w+\S?\s?(\d+\s?\d+\s?\d+)|Part No.\s?\s?(\d+\s?\d+\s?\d+)/i);
                if (qwe != null) {
                    pnTab.push(qwe);
                    for (var j = 0; j < pnTab.length; j++) {
                        pnTab[j] = pnTab[j].filter(function (element) {
                            return element !== undefined;
                        });
                    }
                    console.log(pnTab);
                    tabSpace[i] = tabSpace[i].replace(tabSpace[i], '');
                }
            }
        } else {
            alert('Szukam Normalnie');
        }
    }

    function removeSpace() {
        for (var q = 0; q < tabSpace.length; q++) {
            tabSpace[q] = tabSpace[q].replace(/ /g, '');
            tabSpace[q] = tabSpace[q].replace(/-/g, '');
        } test.value = tabSpace.join('\n');
    }

    function clearTab() {
        for (var i = 0; i < regTablica.length; i++) {
            for (var j = 0; j < regTablica[i].length; j++) {
                if (regTablica[i][j].length >= 9) {
                    regTablicaClean.push(regTablica[i][j]);
                }
            }
        }
    }

    function acNumbers(ev) {
        ev.preventDefault();
        fetchpn();
        removeSpace();
        regButton.disabled = true;
        for (var i = 0; i < tabSpace.length; i++) {
            if (pnTab == 0) {
                var regLuke = tabSpace[i].match(/[^\d]?(\d{10})\s?.?\s?(\d+)/);
                regTablica.push(regLuke);
            }

            if (regTablica[i] == null) {
                regTablica.splice(i, 1);
                var regNull = tabSpace[i].match(/\d+/g);
                regTablica.push(regNull);
            }

            if (regTablica[i] == null) {
                regTablica[i] = '';
            }
            /*
            if (isNaN(parseInt(tabSpace[i]))) {
                tabSpace[i] = '';
            }
            */
            //Usuwanie znakow spacji itp.
            for (var j = 0; j < regTablica.length; j++) {
                if (regTablica[i][j] != undefined && regTablica[i][j].length > 4 && regTablica[i][j].length > 11) {
                    console.log('Usuwam zbedne znaki ' + regTablica[i]);
                    regTablica[i].splice(j, 1);
                }
            }
        } //Koniec petli funkcji acNumbers

        // Usuwanie tych inputow z pnTab (funkcja fetchpn())
        for (var k = 0; k < pnTab.length; k++) {
            pnTab[k].splice(0, 1);
        }
        // Usuwanie pustych tablic
        regTablica = regTablica.filter(function (n) {
            return n != '';
        });

        tabSpace = tabSpace.filter(function (n) {
            return n != '';
        });
        //
        //Wywalanie ilosci na przod
        for (var i = 0; i < regTablica.length; i++) {
            if (regTablica[i][0].length < 3) {
                regTablica[i].push(regTablica[i].shift());
            }
        }
        //
        // Zakladam tutaj ze jezeli podaja w mailu PN: NUMER to ze nie podaja potem bez znaku PN z przodu
        if (pnTab.length >= 1) {
            test.value = pnTab.join('\n');
            test.value = test.value.replace(/,/g, '');
            test.value = test.value.replace(/ /g, '');
        } else {
            alert('Wpisujac "nie" wyswietli tylko liczby ktore maja 9 LUB 10, pominie ilosci(slabo dziala jezeli wpiszesz tak, ale warto sprobowac)')
            var user = prompt('Czy wklejasz z ilosciami?', 'tak lub nie')
            if (user == 'nie' && user != null) {
                removeLeftNumbers.disabled = true;
                clearTab(); // Zostawia tylko liczby ktore maja 9 i 10
                test.value = regTablicaClean.join('\n'); // ^---
            } else {
                test.value = regTablica.join('\n');
                test.value = test.value.replace(/,/g, ' ');//<- jezeli nie dam tu spacji to ilosci dolaczaja sie do liczby Atlas copco
            }
        }
    }

    var repeat = 0;
    function removeLeftNum(ev) {
        for (; repeat <= 5; repeat++) {
            console.log(repeat);
            ev.preventDefault();
            //removeLeftNumbers.disabled = true;
            for (var i = 0; i < regTablica.length; i++) {
                for (var j = 0; j < regTablica[i].length; j++) {
                    if (regTablica[i][j].length <= 9) {
                        regTablica[i].splice(j, 1);
                    }
                }
            }
            test.value = regTablica.join('\n');
            test.value = test.value.replace(/,/g, ' ');
            test.value = test.value.replace(/\s+/g, '\n'); // Usuwanie wszystkich spacji
        }   //test.value = test.value.replace(/\s+/g, '\n');
    }
}


// Przed kazda 6 dodaj 0