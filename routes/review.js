const http = require("http");
const express = require('express');
const router = express.Router();
const request = require('request');
const robot = require('robotjs');
const fs = require('fs');

const tasklist = require('tasklist');
const execFile = require('child_process').execFile;

const rp = require('request-promise');
const cheerio = require('cheerio');
const jsdom = require('jsdom').JSDOM;
var phantom = require('phantom');
var Jimp = require('jimp');
var Tesseract = require('tesseract.js');

var loading = require('../loading-module.js');

function startTor() {
    return new Promise((resolve) => {
        const loop = 0;
        execFile('c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\start-tor.bat');
        //load('c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\public\\sound\\robot.wav').then(play);
        tasklist().then(tasks => {
            tasks.forEach((row) => {
                if (row.imageName == 'firefox.exe') {
                    console.log('Tor is active');
                    resolve('tor is active');
                }
            })
        });
    })
}

function wait(x) {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve('done');
        }, x);
    })
}

function randomNum() {
    let wait = Math.random() * 2;
    wait = Math.floor(wait * 1000);
    return wait;
}

function randomMS() {
    let wait = Math.random();
    wait = Math.floor(wait * 1000);

    if (wait < 237) {
        wait = randomNum();
        return wait;
    }
    return wait;
}

function typeStringDelayed_random(word) {
    return new Promise((resolve) => {
        let _word = word.split('');
        _word.forEach((singleWord) => {
            var waitMS = randomMS();
            robot.typeStringDelayed(singleWord, waitMS);
        })
        resolve();
    })
}

function stopTor() {
    return new Promise((resolve) => {
        execFile('c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\killtor.bat');
        resolve();
    })
}

var tabCount = 0;
var imageProcessor = {
    grabImg: function () {
        return new Promise((resolve) => {
            console.log('Grabing img..');
            setTimeout(function () {

                var img = robot.screen.capture();
                let jimg = new Jimp(400, 150);

                //x 46 - 110
                //y 10 - 40
                for (var x = 45; x < 130; x++) {
                    for (var y = 10; y < 40; y++) {
                        var index = (y * img.byteWidth) + (x * img.bytesPerPixel);
                        var r = img.image[index];
                        var g = img.image[index + 1];
                        var b = img.image[index + 2];
                        //var num = (r * 256) + (g * 0 * 0) + (b * 255 * 255 * 255) + 255
                        var num = (r * 256) + (g * 256 * 256) + (b * 256 * 256 * 256) + 255;
                        jimg.setPixelColor(num, x, y);
                        jimg.background(0xFFFFFFFF);
                    }
                }

                jimg.write('c:\\Users\\Mistrz\\Pictures\\Screenshots\\jimpImage.jpg', (sukces) => {
                    resolve('saved');
                })
            }, 2000);
        })
    },

    processImg: function () {
        return new Promise((resolve, reject) => {
            console.log('Starting to process the img..');
            this.grabImg().then(() => {

                Tesseract.recognize('c:\\Users\\Mistrz\\Pictures\\Screenshots\\jimpImage.jpg', {
                    lang: 'eng'
                })
                    .progress(function (p) {
                        //console.log('progress', p)
                    })
                    .then(function (result) {
                        if (tabCount == 0) {
                            //console.log('pressing');
                            robot.keyTap('tab', 'alt');
                            tabCount += 1;
                        }

                        var c = result.text;
                        if (c.includes('Cannedmg') == false) {
                            console.log('No loading');
                            resolve('ok');
                        } else {
                            reject();
                        }
                    })
                    .catch((err) => {
                        console.log('Tesseract error..');
                        console.log(err)
                    })
            })
        })
    },


    getImageText: function () {
        return new Promise((resolve, reject) => {
            this.grabImg().then(() => {
                this.processImg().then((b) => {
                    console.log(b);
                    return resolve('LOADED KURWA');
                }).catch(() => {
                    this.getImageText();
                    console.log('Catch! Still loading..');
                })
            })
        })
    }
}

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('gmail-acc.db');
const sqlite = require('../aa-sqlite.js');

router.get('/', (req, res, next) => {
    let showTables = [];
    let opinie = [];
    db.all('Select name FROM SQLITE_MASTER WHERE TYPE="table"', (err, tablice) => {
        for (var i = 0; i < tablice.length; i++) {
            let tab = tablice[i].name;
            if (tab != 'sqlite_sequence' && tab != 'Opinie' && tab != 'Opinie_manual' && tab != 'Accounts' && tab != 'Negative_accounts') {
                showTables.push(tab);
                /*
                db.each(`SELECT opinia FROM "${tab}"`, (err, tekst) => {
                    console.log(tekst);
                    if (err) return;
                    //opinie.push(tekst.opinia);
                    //opinie.push(tekst);
                }, () => {
                    //console.log(opinie);
                    res.render('opinie/index', { nazwy_firm: showTables, opinie: opinie });
                })
                //console.log(tab);
                */
            }
        }
        
        res.render('opinie/index', { nazwy_firm: showTables });
    })
})

router.get('/show/:company', (req, res, err) => {
    let opinie = [];
    let showTables = [];
    //console.log(req.params);
    db.all('Select name FROM SQLITE_MASTER WHERE TYPE="table"', (err, tablice) => {
        for (var i = 0; i < tablice.length; i++) {
            let tab = tablice[i].name;
            if (tab != 'sqlite_sequence' && tab != 'Opinie' && tab != 'Opinie_manual' && tab != 'Accounts' && tab != 'Negative_accounts') {
                showTables.push(tab);
            }
        }
    })
    //var sql = `SELECT opinia FROM "${req.params.company}"`;
    //console.log(sql);
    db.each(`SELECT opinia FROM "${req.params.company}"`, (err, tekst) => {
        //console.log('Show me tekst');
        //console.log(tekst);
        //opinie.push(tekst.opinia);
        opinie.push(tekst);
    }, () => {
        //console.log(opinie);
        res.render('opinie/index', { nazwy_firm: showTables, opinie: opinie });
        //console.log(opinie);
    })
})

router.get('/add-opinions', (req, res, err) => {
    let logurl = 'gmail.com';
    let loop = 0;
    let sql = `Select login, pw, backup, used_codes From Accounts`;
    let konta = {};
    let checking = false;

    setInterval(() => {
        //console.log(robot.getMousePos());
    }, 1000);

    function done() {
        return new Promise((resolve) => {
            stopTor();
            checking = false;
            resolve();
        })
    }

    async function getAccounts() {
        await sqlite.open('./gmail-acc.db')
        sql = "SELECT * FROM Accounts"
        r = await sqlite.each(sql, [], function (rows) {
            konta[loop] = [];
            konta[loop].login = rows.login;
            konta[loop].pw = rows.pw;
            konta[loop].backup = rows.backup.split(':');
            konta[loop].times_used = rows.used_codes;


            //console.log(konta[loop].backup.split(':'));
            loop++;
            //console.log("Read:", rows.imie, rows.login, rows.pw)
        })

        if (r) {
            //console.log(konta[16].times_used);
            //console.log(konta[16].backup[konta[16].times_used]);
            console.log("Done grabbing accounts from db.")
        }
        sqlite.close();
    }

    setTimeout(() => {
        //getAccounts();
        //main(0);
    }, 3000)


    async function login(login, pw, backup, times_used) {
        await sqlite.open('./gmail-acc.db')
        var times_increment = times_used + 1;
        var sql = `Update Accounts SET used_codes = ${times_increment} Where login = '${login}'`
        console.log(sql);
        r = await sqlite.run(sql);

        await typeStringDelayed_random(login);
        await robot.keyTap('enter');
        await wait(1000 * 10);

        await typeStringDelayed_random(pw);
        await robot.keyTap('enter');

        await wait(1000 * 10);

        await robot.keyTap('tab');
        await robot.keyTap('tab');
        await robot.keyTap('tab');

        await robot.keyTap('enter');

        await wait(1000 * 10);

        await robot.keyTap('tab');
        await robot.keyTap('tab');
        await robot.keyTap('tab');

        await robot.keyTap('enter');

        await wait(1000 * 10);

        await typeStringDelayed_random(backup);
        await robot.keyTap('enter');

        sqlite.close();
    }

    async function chuj() {
        console.log('*****************Last step.****************');
        done();
    }

    async function main(id) {
        checking = true;
        await getAccounts();
        await startTor();
        await wait(1000 * 5);

        //Maxim tor
        await robot.moveMouseSmooth(1365, 54);
        await robot.mouseClick();

        //Najezdzanie na pasek url
        await robot.moveMouseSmooth(1332, 48);
        await robot.mouseClick();
        await typeStringDelayed_random('www.knocks.de');
        //await typeStringDelayed_random('gmail.com');

        await robot.scrollMouse(0, 100);
        await robot.keyTap('enter');

        //await imageProcessor.processImg().catch(() => imageProcessor.processImg());
        await loading.processImg().catch(() => loading.processImg());

        console.log('Waiting 5 seconds for login window..');
        await wait(1000 * 5);
        await login(konta[id].login, konta[id].pw, konta[id].backup[konta[id].times_used], konta[id].times_used);
        console.log('Waiting 60 seconds');
        await setTimeout(() => {
            chuj();
        }, 1000 * 60);
    }


    //Petla
    /*
    setTimeout(function () {
        main(7);
        setInterval(() => {
            var loops = 7;
            console.log('Checking if I can start..');
            if (checking == false) {
                loops++;
                //konta = {};
                console.log('Starting another account. Id main: ' + loops);
                main(loops);
                console.log('Loops completed: ' + loops);
            }
        }, 1000 * 20)
    }, 3000);
    */
    setTimeout(() => {
        console.log('start');
        loading.processImg().catch(() => loading.processImg());
    }, 3000);

    res.redirect('/');
})

/*
router.get('/add-accounts-to-db', (req, res, err) => {
    let accounts = ['ticklishduck70745273:HW52xYwZ:7555120204:1196 6491:2974 1809:8341 9272:9439 7862:8441 1226:1192 3278:6813 5466:2266 8867:6113 6713:0250 5158:null',
        'bigfish17758451:VWdWubnD:7586098087:2377 9272:6501 6915:0402 2648:5838 2569:9205 3197:6869 8513:6748 0057:3448 2121:3585 2509:7264 4869:null',
        'orangebear86048951:Byggoew9:7823876029:8601 0870:1959 9644:2035 0026:8887 9145:2378 9771:0655 5291:0100 2219:6415 9721:1979 9077:0697 6942:null',
        'blueladybug47291847:eZCIzSqN:9619280340:8580 6795:1136 9794:4849 2255:5536 7419:5930 6963:9483 0706:0292 2283:3871 5804:0324 8140:6317 3793:null',
        'smallsnake173443:ObcOjHdL:6467 4794:4940 2350:0791 9270:0313 2406:2550 5681:6975 3171:4217 5621:9077 0700:0019 1773:2251 6078:null',
        'happymeercat530693:gNWG53cU:7586098113:0017 6173:3320 6073:0015 6427:2252 5612:2475 0039:5511 2540:3363 6383:8305 3083:1481 4641:2034 4853:null',
        'redzebra565981:syAO3CfJ:7535251880:1701 5882:1717 1910:3852 9141:5295 0282:6598 0192:5438 5780:8721 1687:2722 3784:8886 6345:4584 1661:null',
        'beautifultiger7171841:4lhFpgif:7570722503:7368 9002:9489 5822:8064 0035:7622 5390:2540 8601:6928 4781:9299 9194:0536 3175:4843 9506:3376 2334:null',
        'crazyzebra675934:ZKh0V857:9277799513:0429 8954:9885 5078:4237 1943:7802 8822:9318 6290:4643 0804:0486 1398:0918 5909:2361 2941:3517 6430:null',
        'ticklishbird7471196:Vln4hWbr:9277799650:4139 7001:7843 8111:7505 6461:5305 0816:3829 6356:8800 3864:7076 5837:1439 2686:7241 8592:0438 6446:null',
        'angrywolf592915:iBamxB14:000000:0245 1472:4537 9371:6132 9029:5787 0934:9225 6653:9162 6130:9416 2434:0685 0398:2504 9358:9947 9709:null',
        'organicwolf472490:QRkXBiY9:7469533238:0637 5033:4941 0423:8878 6081:7485 4486:7089 0192:8527 8951:5410 9143:7179 2412:3759 5215:1790 5067:null',
        'bluecat703495:pNx5VO31:7469076717:1752 6720:4283 5391:0878 1548:2705 2618:6764 4608:2472 3280:0653 5524:4460 7280:8075 7754:0139 5967:null',
        'happyfish113717:xYDGeDr9:9277789053:0975 0137:6609 9235:0257 8300:6860 3497:5974 8871:2109 9515:8862 0729:9866 8540:1360 1313:3399 6814:null',
        'smallgorilla268306:00KsU9m5:9115903571:6285 3208:0981 8913:6339 9535:0206 4048:1254 5058:7900 8679:4476 9435:6341 7121:4281 5864:2210 9942:null',
        'purplepeacock6501794:jzx8pBSq:9878200502:1634 9904:2092 4884:7462 3037:3429 3867:3581 3136:2416 9905:8662 9429:8933 5846:2704 8989:2639 3442:null',
        'crazywolf936408:YVE9BtQX:9068487765:6337 3519:5265 6333:1177 2717:3165 3670:5327 5071:8606 1726:7275 5172:3381 3900:2394 8336:6354 8551:Irena Mroz',
        'purplegoose842620:xbIUaI1y:9619346757:3386 8888:4536 8479:2486 4219:4005 6198:2278 3229:2215 6421:8571 5400:6256 7631:7710 0261:4588 3457:null',
        'silverladybug503255:ESiPC0V4:9155415425:8440 2824:7541 2956:1550 5689:2821 2286:2813 2153:8475 7584:6245 5711:3079 9565:6023 4485:8639 2633:Sonia Kaczmarek',
        'greenpanda647937:zHK2xggg:9068495376:7552 6029:8711 5738:8884 4638:2890 0051:8908 3495:8478 0979:4835 6233:5261 4638:7895 4389:8726 0602:Klaudia Walczak'
    ]

    let negative_accounts = [
        'ticklishfrog271617:0XTT0sCz:9277765670:8821 7317:7689 1113:0364 7389:7796 5222:2542 3805:8693 9981:7988 1990:7000 7421:6583 8166:4652 3837:Klaudia Szymczak',
    ]


    accounts.forEach(element => {
        let konto = element.split(':');
        let backup_codes = [];

        //0 - login
        //1 - haslo
        //2 - telefon
        //3-12 - backup

        for (var i = 3; i < konto.length; i++) {
            backup_codes.push(konto[i]);
        }

        backup_codes = backup_codes.join(':');

        db.serialize(function (err) {
            var stmt = db.prepare("INSERT INTO Accounts (login, pw, phone, backup, imie, used_codes) VALUES (?,?,?,?,?,?)");
            if (err) console.log(err);

            stmt.run(konto[0], konto[1], konto[2], backup_codes, konto[13], 0);
            stmt.finalize(function () {
                console.log('done');
            });

            res.status(200);
        });
    });

    res.redirect('/');
})
*/

router.get('/ceneo-scraper', (req, res, err) => {
    console.log('Review section');
    let url = 'https://www.ceneo.pl/sklepy/neo24.pl-s575';
    let opinie = [];
    let loop = false;
    let count = 1;

    var _ph, _page, _outObj;
    function scrape(url) {
        return new Promise((resolve) => {
            phantom.create()
                .then(ph => {
                    _ph = ph;
                    return _ph.createPage();
                }).then(page => {
                    _page = page;
                    return _page.open(url);
                }).then(status => {
                    //console.log(status);
                    return _page.property('content');
                }).then(content => {
                    var $ = cheerio.load(content);

                    $('.review-body').each(function (i) {
                        console.log($(this).text().trim());
                        opinie.push($(this).text().trim());
                        let opinia = $(this).text().trim();


                        db.serialize(function (err) {
                            var stmt = db.prepare("INSERT INTO Opinie (tekst, used_by, category, times_used) VALUES (?,?,?,?)");
                            if (err) console.log(err);

                            stmt.run(opinia, '', 'Ceneo', 0);
                            stmt.finalize(function () {
                                console.log('done');
                            });

                            res.status(200);
                        });
                    })
                    _page.close();
                    _ph.exit();
                    loop = true;
                    resolve('done');
                }).catch(e => console.log('Co to kurwa jest: ' + e))
        })
    }

    async function ssij() {
        await scrape(url);
        console.log('ssij');

    }

    setInterval(() => {
        if (loop == true) {
            loop = false;
            count += 1;
            console.log('Starting another round');
            url = 'https://www.ceneo.pl/sklepy/neo24.pl-s575/opinie-' + count;
            scrape(url);
        }
    }, 5000)

    ssij();
    res.redirect('/');
})


function createNewCompany(company) {
    console.log('Starting');
    let db = new sqlite3.Database('gmail-acc.db');
    db.run(`CREATE TABLE IF NOT EXISTS "${company}"(opinia text, used text)`);
    //db.run(`INSERT INTO "${company}"(opinia, used) VALUES(null, "no")`)
    db.close();
}


router.get('/new-company', (req, res, err) => {
    /*
    createNewCompany('Zloty Pstrag');
    createNewCompany('Taxi Klodzko');
    createNewCompany('Wawasuv');
    createNewCompany('Coridon Cars');
    createNewCompany('Quick Service Katowice');
    createNewCompany('iCure.pl');
    createNewCompany('iCure 3 Maja 12, Kalisz');
    createNewCompany('Gecon internet service provider');
    */
    res.redirect('/review');
})

router.get('/add', (req, res, err) => {
    res.redirect('/review');
})

router.post('/add', (req, res, err) => {
    console.log('Posting something via /review/add')
    console.log(req.body);
    let db = new sqlite3.Database('gmail-acc.db');
    db.run(`INSERT INTO "${req.body.firma}" (opinia, used) VALUES("${req.body.opinia}", "no")`);
    res.redirect('/review/show/Wawasuv');
})

router.post('/del', (req, res, err) => {
    //console.log(req.body[0]);
    console.log('DELETING');
    //db.run(`DELETE FROM "${req.body.firma}" WHERE opinia = "${req.body[0]}`);
    res.redirect('/review');
})

module.exports = router;