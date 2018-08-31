const http = require("http");
const express = require('express');
const router = express.Router();
const request = require('request');
const robot = require('robotjs');
const fs = require('fs');
const say = require('say');
const play = require('audio-play');
const load = require('audio-loader');

var rp = require('request-promise');
var Tesseract = require('tesseract.js');
var Jimp = require('jimp');

const tasklist = require('tasklist');
const execFile = require('child_process').execFile;
var loading = require('../loading-module.js');

router.get('/robot', (req, res, next) => {
    robot.setMouseDelay(2);

    var twoPI = Math.PI * 2.0;
    var screenSize = robot.getScreenSize();
    var height = (screenSize.height / 2) - 10;
    var width = screenSize.width;
    var pos = true;
    let checkText = 'pusto';
    let balance = 0;
    let phoneNumber = 0, phoneId = 0;
    let smsCode = 0;
    let phoneCountry = 'uk';
    let kontoJson = {};
    let countAccount = 0;
    let retryCount = 0;

    let createdMail = [], password = [], usedPhone = [], nameArr = [];

    /*
    console.log('******************');
    console.log('TwoPi: ' + twoPI);
    console.log(screenSize);
    console.log('Height: ' + height);
    console.log('Width: ' + width);
    console.log('*****************');
    */
    console.log('************************************');
    console.log('Welcome to Gmail Account Creator');
    console.log('************************************')
    //say.speak('Initializing Gmail Account Creator.', 'Microsoft David Desktop', 1, (i) => {
    //})

    /*
    setInterval(() => {
        console.log(robot.getMousePos());
    }, 1000);
    */

    function startOpera() {
        execFile('c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\test.bat');
    }

    function startTor() {
        return new Promise((resolve) => {
            const loop = 0;
            execFile('c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\start-tor.bat');
            //load('c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\public\\sound\\robot.wav').then(play);
            tasklist().then(tasks => {
                tasks.forEach((row) => {
                    if (row.imageName == 'firefox.exe') {
                        console.log('Tor is active');
                        resolve('tor-active');
                    }
                })
            });
        })
    }

    function stopTor() {
        return new Promise((resolve) => {
            execFile('c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\killtor.bat');
            resolve();
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

    function getBalance() {
        return 'http://smspva.com/priemnik.php?metod=get_balance&service=opt1';

    }

    function getPhone() {
        return 'http://smspva.com/priemnik.php?metod=get_number&country=' + phoneCountry + '&service=opt1&id=1';
    }

    function banNumber(phoneId) {
        //return 'http://smspva.com/priemnik.php?metod=ban&service=opt1' + phoneId;
        return 'http://smspva.com/priemnik.php?metod=ban&service=opt1&apikey=tClxdat9Wj5a8FPDLtGOkvGUc964uQ&id=' + phoneId;
    }



    var options = {
        uri: getBalance(),
        timeout: 10000,
        qs: {
            apikey: 'tClxdat9Wj5a8FPDLtGOkvGUc964uQ' // -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };

    var smsPva = {
        phoneNumber: null,

        getBalance: function () {
            return rp({
                uri: getBalance(),
                timeout: 5500,
                qs: {
                    apikey: 'tClxdat9Wj5a8FPDLtGOkvGUc964uQ'
                },
                json: true,
                headers: {
                    'User-Agent': 'Request-Promise'
                }
            }).then((balanceBody) => {
                balance = balanceBody.balance;
                console.log('Twoj balance: ' + balance);
                if (balance <= 0) throw Error('Nie ma kasy na SMSPVA.COM!');

                return balance;
            })
        },

        getPhone: function () {
            return rp({
                uri: getPhone(),
                timeout: 5500,
                qs: {
                    apikey: 'tClxdat9Wj5a8FPDLtGOkvGUc964uQ'
                },
                json: true,
                headers: {
                    'User-Agent': 'Request-Promise'
                }
            }).then((phoneBody) => {
                phoneNumber = phoneBody.number;
                phoneId = phoneBody.id;

                console.log('Numer telefonu: ' + phoneNumber);
                console.log('Id telefonu: ' + phoneId);


                if (phoneNumber == null) {
                    console.log(phoneBody);
                    throw Error('Brak numerow!!');
                    process.exit(0);
                }

                usedPhone.push(phoneNumber);
                console.log('Pushed phone number');

                //Tutaj wpisujemy numer telefonu do inputa i klikamy dalej
                robot.setKeyboardDelay(1342);
                typeStringDelayed_random(phoneNumber);


                //Klikanie next w phone verification
                robot.setMouseDelay(1421);
                robot.moveMouseSmooth(949, 676);
                robot.mouseClick();

            }).then(() => {
                processImgText().then(() => {

                    setTimeout(() => {
                        this.getSmsCode(phoneId);
                    //Zmieniam z 40 na 15 sek
                    }, 1000 * 15);

                }).catch((err) => {
                    retryCount += 1;
                    console.log('Clearing phone input field..');
                    robot.keyTap('backspace', 'control');
                    typeStringDelayed_random('44');
                    usedPhone = [];
                    console.log('Baning: ' + phoneId);
                    request.get(banNumber(phoneId));
                    //banNumber(phoneId);
                    if (retryCount > 3) {
                        stopTor();
                        accCreated = false;
                        console.log('Changing ip...');
                        //throw new Error('Za duzo razy wpisano zly numer! Change ip!');
                    }

                    console.log('Waiting 5 seconds and retrying..');
                    console.log('Retry count: ' + retryCount);
                    setTimeout(() => {
                        main();
                    }, 1000 * 5);
                })
            })
        },

        getSmsCode: function (phoneId) {
            console.log('Zaczynam pobieranie sms..');
            let retrySmsGrab = 0;
            return rp({
                uri: "http://smspva.com/priemnik.php?metod=get_sms&country=" + phoneCountry + "&service=opt1&id=" + phoneId + "&apikey=tClxdat9Wj5a8FPDLtGOkvGUc964uQ",
                timeout: 1000 * 60,
                qs: {
                    apikey: 'tClxdat9Wj5a8FPDLtGOkvGUc964uQ'
                },
                json: true,
                headers: {
                    'User-Agent': 'Request-Promise'
                }
            }).then((smsBody) => {
                //console.log('Sms response:');
                //console.log(smsBody);
                smsCode = smsBody.sms;
                console.log('Text sms: ' + smsCode);
                if (smsBody.text == null || smsBody.text == '') {
                    console.log('SMS jest null, retrying..');
                    retrySmsGrab += 1;
                    //throw new Error('sms is null!');
                    if (retrySmsGrab == 3) {
                        console.log('Waiting 10 seconds and retrying with another number..');
                        robot.setMouseDelay(982);
                        robot.moveMouseSmooth(640, 685);
                        robot.mouseClick();
                        if (phoneCountry == 'uk') typeStringDelayed_random('+44');
                        if (phoneCountry == 'ru') typeStringDelayed_random('+7');
                        setTimeout(() => {
                            main();
                        }, 1000 * 10);
                    } else {
                        this.getSmsCode();
                    }
                }

                if (smsBody.response != '3' && smsBody.text != null) {
                    console.log('Typing in sms');
                    //robot.keyTap('tab');
                    //robot.moveMouseSmooth(740, 630);
                    //robot.mouseClick();
                    typeStringDelayed_random(smsBody.sms);
                    //robot.typeStringDelayed(smsBody.sms, 142);
                    robot.keyTap('enter');

                    console.log('Verification complete.. moving on');
                    /********
                     * TERAZ ZAZNACZANIE DATY URODZENIA I INNE
                     */
                    setTimeout(function () {
                        dataUrodzenia().then(() => {

                            //Zaznaczenie 2 buttonow
                            robot.moveMouseSmooth(635, 703);
                            robot.mouseClick();
                            robot.moveMouseSmooth(631, 735);
                            robot.mouseClick();

                            //Zaznaczanie ze sie zgadzam
                            robot.moveMouseSmooth(837, 777);
                            robot.mouseClick();
                        }).then(() => {
                            // WARUNKI SCROLLOWANIE I PUSHOWANIE KONTA DO JSON
                            termScroll().then((termCheck) => {

                                if (termCheck == 'terms is set') {

                                    //Ustawianie JSON
                                    nameArr = nameArr.join(' ');

                                    kontoJson[countAccount] = [];
                                    kontoJson[countAccount].Mail = createdMail[0];
                                    kontoJson[countAccount].Pw = password[0];
                                    kontoJson[countAccount].Phone = usedPhone[0];
                                    kontoJson[countAccount].Name = nameArr;

                                    console.log('Successfuly created a gmail account!');
                                    console.log(kontoJson);
                                    countAccount += 1;
                                    console.log('Current count is: ' + countAccount);
                                    robot.setMouseDelay(1000);
                                    robot.setKeyboardDelay(1142);
                                    robot.moveMouseSmooth(647, 48);
                                    robot.mouseClick();
                                    robot.keyTap('backspace');
                                    robot.typeString('https://myaccount.google.com/');
                                    robot.keyTap('enter');
                                    return 'account created';
                                }
                            }).then((afterCreatedAccount) => {
                                console.log('Starting to grab backup codes in 20 seconds...');
                                
                                setTimeout(function () {
                                    grabCodes();
                                }, 1000 * 20);
                                
                            })
                        })
                    }, 5000);
                }
                return smsCode;
            })
        }
    }

    function main() {
        return smsPva.getBalance()
            .then(function () {
                smsPva.getPhone()
            })
    }


    function dataUrodzenia() {
        return new Promise((resolve) => {
            //TOR
            console.log('Setting birthdate...');
            if (phoneCountry == 'uk' || phoneCountry == 'ru') {
                console.log('Checking if gender is available here:');
                console.log(gender);
                robot.keyTap('tab');
                robot.keyTap('tab');

                //Birth month
                robot.keyTap('down');
                robot.keyTap('down');

                robot.keyTap('tab');
                typeStringDelayed_random(birthDay);
                robot.keyTap('tab');
                typeStringDelayed_random(birthYear);
                robot.keyTap('tab');

                if (gender == 'female') {
                    robot.keyTap('down');
                }

                if (gender == 'male') {
                    robot.keyTap('down');
                    robot.keyTap('down');
                }
                //robot.keyTap('down');
                //robot.keyTap('down');
                robot.moveMouseSmooth(947, 881);
                robot.mouseClick();

                setTimeout(function () {
                    robot.moveMouseSmooth(867, 728);
                    robot.mouseClick();
                    console.log('Birth date is set');
                    resolve('Birth date is set');
                }, 1000)
            }
        })
    }

    function termScroll() {
        return new Promise((resolve) => {
            //TOR 

            //6x tab enter
            //15x tab enter
            //check boxes
            robot.setKeyboardDelay(300);
            console.log('Starting termScrolling process..');
            robot.keyTap('tab');
            robot.keyTap('tab');
            robot.keyTap('tab');
            robot.keyTap('tab');
            robot.keyTap('tab');
            robot.keyTap('tab');
            robot.keyTap('enter');
            
            setTimeout(() => {

                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                robot.keyTap('tab');
                //robot.keyTap('tab');
                robot.keyTap('enter');
            }, 3000);

            setTimeout(() => {
                robot.setMouseDelay(1000);
                robot.moveMouseSmooth(631, 699);
                robot.mouseClick();
                robot.moveMouseSmooth(633, 733);
                robot.mouseClick();

                robot.moveMouseSmooth(910, 812);
                robot.mouseClick();
                setTimeout(() => {
                    robot.moveMouseSmooth(1188, 661);
                    robot.mouseClick();
                    console.log('Terms are set.. almost complete');
                    resolve('terms is set');
                }, 5000);
            }, 7000);
            /*
            robot.setMouseDelay(1500);
            robot.moveMouseSmooth(811, 817);
            robot.mouseClick();
            robot.mouseClick();
            robot.mouseClick();

            //Klikanie create account
            robot.moveMouseSmooth(920, 820);
            robot.mouseClick();

            setTimeout(() => {
                robot.setMouseDelay(1500);
                robot.moveMouseSmooth(698, 574);
                robot.mouseClick();
                robot.moveMouseSmooth(807, 818);
                robot.mouseClick();
                robot.mouseClick();
                robot.mouseClick();
                robot.mouseClick();
                robot.mouseClick();

                setTimeout(() => {
                    robot.setMouseDelay(1000);
                    robot.moveMouseSmooth(632, 649);
                    robot.mouseClick();
                    robot.moveMouseSmooth(634, 707);
                    robot.mouseClick();
                    setTimeout(() => {
                        robot.setMouseDelay(2000);
                        //Klik next
                        robot.moveMouseSmooth(910, 812);
                        robot.mouseClick();

                        console.log('5 seconds.. checking if there is another confirmation.');
                        setTimeout(() => {
                            robot.moveMouseSmooth(1188, 661);
                            robot.mouseClick();
                            console.log('Terms are set.. almost complete');
                            resolve('terms is set');
                        }, 5000);
                    }, 2000);
                }, 3000);
            }, 2000);
            */
        })
    }

    function grabImg() {
        return new Promise((resolve) => {
            console.log('Grabing img..');
            setTimeout(function () {

                var img = robot.screen.capture();
                let jimg = new Jimp(1050, 670);

                for (var x = 620; x < 1050; x++) {
                    for (var y = 200; y < 670; y++) {
                        var index = (y * img.byteWidth) + (x * img.bytesPerPixel);
                        var r = img.image[index];
                        var g = img.image[index + 1];
                        var b = img.image[index + 2];
                        var num = (r * 256) + (g * 256 * 256) + (b * 256 * 256 * 256) + 255;
                        jimg.setPixelColor(num, x, y);
                    }
                }

                jimg.write('c:\\Users\\Mistrz\\Pictures\\Screenshots\\jimpImage.png', (sukces) => {
                    resolve('saved');
                })
            }, 4000);
        })
    }

    let tabCount = 0;
    function processImg() {
        return new Promise((resolve) => {
            console.log('Starting to process the img..');
            Tesseract.recognize('c:\\Users\\Mistrz\\Pictures\\Screenshots\\jimpImage.png', {
                lang: 'eng'
            })
                .progress(function (p) {
                    //console.log('progress', p)
                })
                .then(function (result) {
                    /*
                    if (tabCount == 0) {
                        //console.log('pressing');
                        robot.keyTap('tab', 'alt');
                        tabCount += 1;
                    }
                    */

                    console.log('Done processing img..');
                    //console.log(result.text);
                    checkText = result.text;
                    resolve(result.text);
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }

    //Zwraca promise
    function getImageText() {
        return new Promise((resolve) => {
            grabImg().then((a) => {
                processImg().then((b) => {
                    resolve(b);
                })
            })
        })
    }

    function killTesseractNode() {
        execFile('c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\kill-node.bat');
    }

    let _isPhoneRequired = false;

    function processImgText() {
        return new Promise((resolve, reject) => {
            getImageText().then((imgText) => {
                if (imgText.search('Verify your') != -1 ||
                    imgText.search('Weryﬁkowanie') != -1) {
                    _isPhoneRequired = true;
                    console.log('Phone verification is required.. proceeding');
                }


                if (imgText.search('phone number Carmel') != -1 ||
                    imgText.search('phone number cannot') != -1 ||
                    imgText.search('has been used') != -1 ||
                    imgText.search('cannot be') != -1 ||
                    imgText.search('phone number has been') != -1) {
                    let rejectErr = new Error('banned');
                    reject(rejectErr);
                    console.log('Phone number is banned, retrying..');
                }

                resolve(_isPhoneRequired);
            })
        })
    }

    function setFlagOpera() {
        return new Promise((resolve) => {
            console.log('Klikam we flage');

            robot.moveMouseSmooth(684, 593);
            robot.mouseClick();

            //OPERA EDITION

            if (phoneCountry == 'ph') {
                setTimeout(function () {
                    robot.typeStringDelayed('p', 132);
                    robot.typeStringDelayed('p', 87);
                    robot.typeStringDelayed('p', 111);
                    robot.typeStringDelayed('p', 376);
                    robot.typeStringDelayed('p', 311);
                    robot.typeStringDelayed('p', 287);
                    robot.typeStringDelayed('p', 190);
                    robot.typeStringDelayed('p', 216);
                    robot.typeStringDelayed('p', 269);
                    robot.keyTap('enter');
                    resolve('Flag is set');
                }, 2000)
            }

        })
    }


    function setFlag() {
        return new Promise((resolve) => {
            console.log('Setting flag, please wait..');

            if (phoneCountry == 'uk') {
                setTimeout(function () {
                    robot.moveMouseSmooth(764, 579);
                    robot.mouseClick();
                    robot.keyTap('backspace', 'control');
                    typeStringDelayed_random('+44');
                    setTimeout(function () {
                        resolve('Flag is set');
                    }, 2000)
                }, 1000)
            }

            if (phoneCountry == 'pl') {
                setTimeout(function () {
                    robot.moveMouseSmooth(764, 579);
                    robot.mouseClick();
                    robot.keyTap('backspace', 'control');
                    typeStringDelayed_random('+48');
                    setTimeout(function () {
                        resolve('Flag is set');
                    }, 2000)
                }, 1000)
            }

            if (phoneCountry == 'ru') {
                setTimeout(function () {
                    robot.moveMouseSmooth(764, 579);
                    robot.mouseClick();
                    robot.keyTap('backspace', 'control');
                    typeStringDelayed_random('+7');
                    setTimeout(function () {
                        resolve('Flag is set');
                    }, 2000)
                }, 1000)
            }
            if (phoneCountry == 'ph') {
                setTimeout(function () {
                    typeStringDelayed_random('p');
                    typeStringDelayed_random('p');
                    typeStringDelayed_random('p');
                    typeStringDelayed_random('p');
                    typeStringDelayed_random('p');
                    typeStringDelayed_random('p');
                    typeStringDelayed_random('p');
                    typeStringDelayed_random('p');

                    robot.keyTap('enter');
                    robot.moveMouseSmooth(893, 545);
                    resolve('Flag is set');
                }, 2000)
            }
        })
    }

    function setBrowserLanguageToENG() {
        return new Promise((resolve) => {
            robot.moveMouseSmooth(629, 874);
            wait(1500).then(() => {
                robot.mouseClick('left');
                wait(300).then(() => {
                    robot.moveMouseSmooth(653, 243);
                    robot.mouseClick();
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                })
            })
        })
    }

    function setBrowserLanguageToPL() {
        return new Promise((resolve) => {
            robot.moveMouseSmooth(654, 869);
            robot.mouseClick();
            wait(1000 * 2).then(() => {
                console.log('seting lang');
                robot.scrollMouse(0, -1000);

                wait(1000 * 2).then(() => {
                    robot.moveMouseSmooth(634, 660);
                    robot.mouseClick();

                    setTimeout(function () {
                        console.log('lang is set');
                        resolve('language is set');
                    }, 2000)
                })
            })
        })
    }

    function typeStringDelayed_random(word) {
        return new Promise((resolve) => {
            let _word = word.split('');
            _word.forEach((singleWord) => {
                var waitMS = randomMS();
                if (waitMS > 1100) waitMS = (waitMS / 2);
                robot.typeStringDelayed(singleWord, waitMS);
            })
            resolve();
        })
    }

    function getRandomName() {
        return rp({
            uri: 'https://uinames.com/api/?region=poland&ext',
        })
            .then((name) => {
                data = JSON.parse(name);
                firstName = data.name;
                gender = data.gender;
                nameArr.push(firstName);
                console.log('Twoj firstName: ' + firstName);
                return firstName;
            })
    }

    function getRandomLastName() {
        return rp({
            uri: 'https://uinames.com/api/?region=poland&ext',
        })
            .then((name) => {
                data = JSON.parse(name);
                lastName = data.surname;
                lastName = lastName.normalize('NFD').replace(/[^\x00-\x7F]+/g, '');
                nameArr.push(lastName);
                console.log('Twoj last name: ' + lastName);
                return lastName;
            })
    }

    function getRandomLogin() {
        return rp({
            uri: 'https://randomuser.me/api/?nat=gb,us,fr',
        })
            .then((name) => {
                var dzej = JSON.parse(name);
                login = dzej.results[0].login.username + randomMS();
                console.log('Twoj login: ' + login);
                return login;
            })
    }

    function getRandomPassword() {
        return rp({
            uri: 'https://randomuser.me/api/?nat=gb,us,fr',
        })
            .then((name) => {
                var dzej = JSON.parse(name);
                pw = dzej.results[0].login.salt;
                console.log('Twoje haslo: ' + pw);
                return pw;
            })
    }

    function getRandomBirthday() {
        return rp({
            uri: 'https://uinames.com/api/?region=poland&ext',
        })
            .then((name) => {
                data = JSON.parse(name);
                birthDay = data.birthday.dmy.split('/')[0];
                if (birthDay > 28) birthDay -= 10;
                birthYear = data.birthday.dmy.split('/')[2];
                console.log('Your birthday: ' + birthDay + '/05/' + birthYear);
                return birthDay;
            })
    }

    function getRandomPic(gen) {
        return rp({
            uri: 'https://randomuser.me/api/' + '?gender=' + gen,
        })
            .then((name) => {
                data = JSON.parse(name);
                pic = data.results[0].picture.large;
                console.log(data.results[0].picture.large);
                downloadPic(pic, './public/images/google-pic.jpg', () => {
                    console.log('pic downloaded');
                });
                return;
            })
    }

    function done() {
        return new Promise((resolve) => {
            accCreated = false;
            return;
        })
    }

    let firstName, lastName, login, pw, birthDay, birthYear, photo, gender;
    let accCreated = true;

    //Start
    async function getRektSon() {
        accCreated = true;

        await getRandomName();
        await getRandomLastName();
        await getRandomLogin();
        await getRandomPassword();
        await getRandomBirthday();
        await getRandomPic(gender);

        await startTor();
        await wait(1000 * 5);
        
        //Maxim tor
        await robot.moveMouseSmooth(1365, 54);
        await robot.mouseClick();
        
        //Najezdzanie na pasek url
        await robot.moveMouseSmooth(1332, 48);
        await robot.mouseClick();
        await typeStringDelayed_random('google signup');
        await robot.scrollMouse(0, 100);
        await robot.keyTap('enter');
        
        console.log('Waiting for duckduck..');
        await loading.processImg().catch(() => loading.processImg());
        //await wait(1000 * 10);

        //Klikanie w link
        await robot.moveMouseSmooth(342, 320);
        await robot.mouseClick();

        console.log('Waiting for google to load..');
        await loading.processImg().catch(() => loading.processImg());
        //await wait(1000 * 20);

        //[TOR] Teraz wpisujemy imie, nazwisko i maila
        await robot.moveMouseSmooth(682, 465);
        await robot.mouseClick();
        await typeStringDelayed_random(firstName);
        await robot.moveMouseSmooth(844, 463);
        await robot.mouseClick();
        await typeStringDelayed_random(lastName);
        await robot.moveMouseSmooth(710, 543);
        await robot.mouseClick();
        await typeStringDelayed_random(login);

        createdMail.push(login);
        await robot.moveMouseSmooth(688, 655);
        await robot.mouseClick();
        await typeStringDelayed_random(pw);

        password.push(pw);
        await robot.moveMouseSmooth(840, 653);
        await robot.mouseClick();
        await typeStringDelayed_random(pw);
        await wait(1291);
        await robot.moveMouseSmooth(950, 771);
        await robot.mouseClick();
        await wait(2173);
        //Tutaj trzeba sprawdzic czy ten mail jest dostepny!

        const isPhoneRequired = await processImgText()

        if (isPhoneRequired == false) {
            console.log('Phone is not required!\nLets continue!');
            await robot.setMouseDelay(2000);
            await robot.moveMouseSmooth(672, 649);
            await robot.mouseClick();
            await robot.moveMouseSmooth(682, 707);
            await robot.mouseClick();
            await robot.setMouseDelay(1000);
            await robot.moveMouseSmooth(826, 647);
            await robot.mouseClick();
            await robot.typeStringDelayed('11');
            await robot.keyTap('tab');
            await robot.setKeyboardDelay(1342);
            await robot.typeStringDelayed('1987');
            await robot.setMouseDelay(1000);
            await robot.moveMouseSmooth(706, 745);
            await robot.mouseClick();
            await robot.moveMouseSmooth(678, 803);
            await robot.mouseClick();
            await robot.setMouseDelay(1000);
            await robot.moveMouseSmooth(972, 895);
            await robot.mouseClick();

            await robot.setMouseDelay(1264);
            await robot.moveMouseSmooth(813, 639);
            await robot.scrollMouse(0, -2000);
            await robot.setMouseDelay(1532);
            await robot.moveMouseSmooth(651, 720);
            await robot.mouseClick();
            await robot.setMouseDelay(462);
            await robot.moveMouseSmooth(653, 746);
            await robot.setMouseDelay(325);
            await robot.mouseClick();
            await robot.moveMouseSmooth(927, 830);
            await robot.setMouseDelay(153);
            await robot.mouseClick();
            await robot.moveMouseSmooth(1208, 669);
            await robot.mouseClick();

        } else {
            console.log('Zassysam numer...');

            //Ustawianie flagi
            await setFlag();
            //await setFlagOpera();

            //Logika zasysania numeru, wprowadzania, zbierania sms itp.
            await main();
        }
    }

    let usedPhone_Codes = [];
    var smsPva_GrabCodes = {
        phoneNumber: null,

        getBalance: function () {
            return rp({
                uri: getBalance(),
                timeout: 5500,
                qs: {
                    apikey: 'tClxdat9Wj5a8FPDLtGOkvGUc964uQ'
                },
                json: true,
                headers: {
                    'User-Agent': 'Request-Promise'
                }
            }).then((balanceBody) => {
                balance = balanceBody.balance;
                console.log('Twoj balance: ' + balance);
                if (balance <= 0) throw Error('Nie ma kasy na SMSPVA.COM!');

                return balance;
            })
        },

        getPhone: function () {
            return rp({
                uri: 'http://smspva.com/priemnik.php?metod=get_number&country=ru&service=opt1&id=1',
                timeout: 5500,
                qs: {
                    apikey: 'tClxdat9Wj5a8FPDLtGOkvGUc964uQ'
                },
                json: true,
                headers: {
                    'User-Agent': 'Request-Promise'
                }
            }).then((phoneBody) => {
                phoneNumber = phoneBody.number;
                phoneId = phoneBody.id;

                console.log('Numer telefonu: ' + phoneNumber);
                console.log('Id telefonu: ' + phoneId);


                if (phoneNumber == null) {
                    console.log(phoneBody);
                    console.log('Brak numeru, retrying in 15 seconds...');
                    setTimeout(() => {
                        this.getPhone();
                    }, 1000 * 15)
                }

                if (phoneNumber != null) {
                    usedPhone_Codes.push(phoneNumber);
                    console.log('Pushed phone number: ' + phoneNumber);

                    //Tutaj wpisujemy numer telefonu do inputa i klikamy dalej
                    robot.setKeyboardDelay(1342);

                    //Dodaje tutaj 7 jako ze ruski
                    typeStringDelayed_random('7');
                    typeStringDelayed_random(phoneNumber);

                    //Klikanie next w phone verification
                    robot.moveMouseSmooth(1209, 881);
                    robot.mouseClick();

                    setTimeout(() => {
                        console.log('Waiting 40 seconds for sms to arrive...');
                        var o = 40;
                        var x = setInterval(() => {
                            console.log(o);
                            o -= 1;

                            if (o == 0) clearInterval(x);
                        }, 1000);
                        console.log('Trzeba w tym miejscu dodac sprawdzanie\n czy wpisany numer telefonu nie jest zly.');
                        setTimeout(() => {
                            console.log('Twoje phoneID: ' + phoneId)
                            this.getSmsCode(phoneId);
                        }, 1000 * 40);
                    }, 4000)
                }
            })
        },

        getSmsCode: function (phoneId) {
            console.log('Zaczynam pobieranie smsa do weryfikacji 2-etapowej..');
            return rp({
                uri: "http://smspva.com/priemnik.php?metod=get_sms&country=ru&service=opt1&id=" + phoneId + "&apikey=tClxdat9Wj5a8FPDLtGOkvGUc964uQ",
                timeout: 1000 * 60,
                qs: {
                    apikey: 'tClxdat9Wj5a8FPDLtGOkvGUc964uQ'
                },
                json: true,
                headers: {
                    'User-Agent': 'Request-Promise'
                }
            }).then((smsBody) => {
                console.log('Sms received!');
                console.log('Text smsa: ' + smsBody.text);
                smsCode = smsBody.sms;

                if (smsBody.text == null) {
                    console.log('sms jest null sprawdzam jeszcze raz..Nie wiem czy to zadziala.');
                    this.getSmsCode();
                }

                if (smsBody.response != '3' && smsBody.text != null) {
                    typeStringDelayed_random(smsBody.sms);
                    robot.keyTap('enter');

                    setTimeout(function () {

                        //Zaznaczanie ze sie zgadzam czy TURN ON 2FA verify?
                        robot.moveMouseSmooth(1211, 553);
                        robot.mouseClick();

                        setTimeout(() => {
                            console.log('To powinno pokazac przed setting backup codes');
                            kontoJson[0].Code_Verify_Phone = usedPhone_Codes[0];
                            console.log('Skonczylem wprowadzac weryfikacje 2 etapowa.')
                            return 'done';
                        }, 4000);
                    }, 5000);
                }
            }).then(() => {
                console.log('Za 20 sekund zassam backup codes.');
                setTimeout(() => {
                    setBackupCode();
                }, 1000 * 20);
            })

        }
    }

    function grabImgCodes() {
        return new Promise((resolve) => {
            setTimeout(function () {
                var img = robot.screen.capture();
                let jimg = new Jimp(1300, 670);

                for (var x = 770; x < 1140; x++) {
                    for (var y = 375; y < 530; y++) {
                        var index = (y * img.byteWidth) + (x * img.bytesPerPixel);
                        var r = img.image[index];
                        var g = img.image[index + 1];
                        var b = img.image[index + 2];
                        var num = (r * 256) + (g * 256 * 256) + (b * 256 * 256 * 256) + 255;
                        jimg.setPixelColor(num, x, y);
                    }
                }

                jimg.write('c:\\Users\\Mistrz\\Pictures\\Screenshots\\jimpImage.png', (sukces) => {
                    resolve('saved');
                })
            }, 4000);
        })
    }

    function processImgBackupCodes() {
        let d = new Date();
        let dataPliku = (d.toLocaleString().split(',')[0] + '-' + d.toLocaleTimeString()).replace(/\./g, '-').replace(/\:/g, '-');
        let save_account = [];
        return new Promise((resolve) => {
            Tesseract.recognize('c:\\Users\\Mistrz\\Pictures\\Screenshots\\jimpImage.png', {
                lang: 'eng'
            })
                .progress(function (p) {
                })
                .then(function (result) {
                    /*
                    if (tabCount == 0) {
                        robot.keyTap('tab', 'alt');
                        tabCount += 1;
                    }
                    */
                   
                    var regExp = result.text.split('D');
                    var regArray = [];
                    regExp.forEach((i) => {
                        regArray.push(i.match(/\d+/g));

                    })

                    for (var i = 0; i < regArray.length; i++) {
                        if (regArray[i] != null) {
                            if (regArray[i].length == 2) {
                                regArray[i] = regArray[i].join(' ');
                            } else {
                                regArray[i] = regArray[i].toString();
                            }
                        }
                    }

                    checkText = result.text;
                    if (regArray[0] == null) regArray.shift();

                    kontoJson[countAccount - 1].Backup = regArray.join(':');
                    console.log('Konto GMAIL zostalo stworzone pomyslnie.');
                    console.log(kontoJson[countAccount - 1].Name);
                    console.log(kontoJson[countAccount - 1].Mail);
                    console.log(kontoJson[countAccount - 1].Pw);
                    console.log(kontoJson[countAccount - 1].Phone);
                    console.log(kontoJson[countAccount - 1].Code_Verify_Phone);
                    console.log(kontoJson[countAccount - 1].Backup);

                    save_account.push(kontoJson[countAccount - 1].Mail);
                    save_account.push(kontoJson[countAccount - 1].Pw);
                    save_account.push(kontoJson[countAccount - 1].Code_Verify_Phone);
                    save_account.push(kontoJson[countAccount - 1].Backup);
                    save_account.push(kontoJson[countAccount - 1].Name);
                }).then(() => {
                    fs.writeFile("c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\GmailAccounts\\" + dataPliku + ".txt", save_account.join(':'), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        //KONIECPROGRAMU
                        setGooglePlus().then(() => {
                            console.log('google+ created');
                            console.log('Teraz trzeba zrobic zeby przechodzil na jakas stronke');
                            console.log('Za 10 sekund wystawie opinie..');
                            setTimeout(() => {
                                postReview('zloty pstrag radzyn', 'Bardzo smaczny mietus, naprawde najlepszy w okolicy. Jakosc przedewszystkim!').then(() => {
                                    done();
                                    stopTor();
                                    console.log('Recenzja postnieta');
                                    resolve('account complete');
                                })
                            }, 1000 * 10)
                        })
                        console.log("The file was saved!\nOperation complete!");
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }

    async function setBackupCode() {
        robot.moveMouseSmooth(735, 868);
        robot.mouseClick();
        await grabImgCodes();
        await processImgBackupCodes();
    }

    function startPhoneGrabing() {
        return smsPva_GrabCodes.getBalance()
            .then(function () {
                smsPva_GrabCodes.getPhone()
            })
    }

    async function grabCodes() {
        robot.moveMouseSmooth(443, 693);
        robot.mouseClick();
        await wait(6758);
        robot.moveMouseSmooth(1279, 661);
        robot.mouseClick();
        await wait(5612);
        robot.moveMouseSmooth(1203, 767);
        robot.mouseClick();
        await wait(8796);
        //password[0]?
        //typeStringDelayed_random('syAO3CfJ');
        typeStringDelayed_random(kontoJson[0].Pw);
        robot.moveMouseSmooth(1099, 644);
        robot.mouseClick();

        console.log('Waiting 15 seconds...');
        await wait(14698);

        //Twice
        robot.keyTap('backspace', 'control');
        robot.keyTap('backspace', 'control');
        robot.keyTap('backspace', 'control');

        //Grab UK number
        await startPhoneGrabing();

    }

    //Start Program Function
    async function startRektingThisMotherFucker() {
        await getRektSon();
    }

    //Reset
    function resetArrays() {
        countAccount = 0;
        nameArr = [];
        kontoJson = {};
        firstName = '';
        lastName = '';
        login = '';
        pw = '';
        birthDay = '';
        birthYear = '';
        photo = '';
        gender = '';
    }

    //Petla
    
    setTimeout(function () {
        getRektSon();
        setInterval(() => {
            var loops = 0;
            console.log('Checking if account creation can be started');
            if (accCreated == false) {
                loops++;
                resetArrays();
                console.log('Starting account creation');
                startRektingThisMotherFucker();
                accCreated = true;
                console.log('Loops completed: ' + loops);
            }
        }, 1000 * 80)
    }, 3000);
    


    function downloadPic(uri, filename, callback) {
        return new Promise((resolve) => {
            request.head(uri, function (err, res, body) {
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);
                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                request(uri).on('complete', function () {
                    resolve()
                });
            });
        })
    }

    async function setGooglePlus() {
        await robot.setMouseDelay(1000);
        await robot.moveMouseSmooth(516, 47);
        await robot.mouseClick();
        await typeStringDelayed_random('https://plus.google.com');
        await robot.keyTap('enter');
        //await wait(1000 * 15);
        //Wait google plus load
        await loading.processImg().catch(() => loading.processImg());
        //await wait(1000 * 5);

        await robot.moveMouseSmooth(96, 223);
        await robot.mouseClick();
        await wait(1000 * 5);
        await robot.moveMouseSmooth(1136, 833);
        await robot.mouseClick();
        await wait(1000 * 5);
        await robot.moveMouseSmooth(965, 527);
        await robot.mouseClick();
        await wait(1000 * 5);
        await robot.moveMouseSmooth(779, 411);
        await robot.mouseClick();
        await wait(1000 * 5);
        await robot.moveMouseSmooth(438, 477);
        await robot.mouseClick();
        await wait(1000 * 5);
        await robot.typeString('c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\public\\images\\google-pic.jpg');
        //await typeStringDelayed_random('c:\\Users\\Mistrz\\Desktop\\Bolo-Github\\bolo\\public\\images\\google-pic.jpg');
        await robot.keyTap('enter');
        await wait(1000 * 5);
        await robot.moveMouseSmooth(1159, 836);
        await robot.mouseClick();
        await wait(1000 * 10);
        await robot.moveMouseSmooth(513, 47);
        await robot.mouseClick();
        await typeStringDelayed_random('gmail.com');
        await robot.keyTap('enter');
        console.log('Czekamy na zaladowanie gmaila..');
        //await wait(1000 * 30);
        await loading.processImg().catch(() => loading.processImg());
        //Load basic html mail
        await robot.moveMouseSmooth(1714, 1003);
        await robot.mouseClick();
        await wait(1000 * 5);
        
        await robot.moveMouseSmooth(958, 788);
        await robot.mouseClick();
        await robot.mouseClick();
    }

    async function postReview(firma, tekst, ile) {
        let ilosc = 0;

        if (ile == null || ile == undefined) ilosc = 0;

        //Najechanie na pasek url
        await robot.moveMouseSmooth(483, 50);
        await robot.mouseClick();

        //Typowanie firmy
        await typeStringDelayed_random(firma + ' !g');
        await robot.keyTap('enter');

        //Czekamy az strona sie zaladuje
        await loading.processImg().catch(() => loading.processImg());
        //await wait(1000 * 5);

        //Klikamy review button
        await robot.keyTap('f', 'control');
        await typeStringDelayed_random('write a review');
        await robot.keyTap('escape');
        await robot.keyTap('enter');
        await wait(1000 * 5);

        await robot.keyTap('tab');
        await wait(1000);
        await robot.keyTap('tab');
        await wait(1000);
        await robot.keyTap('tab');
        await wait(1000);
        await robot.keyTap('tab');
        await wait(1000);
        await robot.keyTap('tab');
        await wait(1000);

        await robot.keyTap('enter');
        await wait(1000);
        await robot.keyTap('tab');

        await typeStringDelayed_random(tekst);

        await robot.keyTap('tab');
        await wait(1000);
        await robot.keyTap('tab');
        await wait(1000);
        await robot.keyTap('tab');
        await wait(1000);
        await robot.keyTap('enter');

        await wait(1000 * 3);
        await robot.keyTap('tab');
        await robot.keyTap('tab');
        await robot.keyTap('enter');
    }



    setTimeout(() => {
        //termScroll();
        //postReview('pneumatig gdynia', 'swietna firma');
        setInterval(() => {
            //console.log(robot.getMousePos());
        }, 1000);
    }, 3000);

    res.render('browser/index');
})

router.get('/', (req, res, next) => {
    res.render('browser/index');
})

module.exports = router;
