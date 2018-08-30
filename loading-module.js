//Uzywamy tak
//await imageProcessor.processImg().catch(() => imageProcessor.processImg());

var Jimp = require('jimp');
var Tesseract = require('tesseract.js');
var tabCount = 0;
var robot = require('robotjs');

module.exports = {
    grabImg: function () {
        return new Promise((resolve) => {
            console.log('Grabing img..');
            setTimeout(function () {

                var img = robot.screen.capture();
                let jimg = new Jimp(400, 150);

                //x 46 - 110
                //y 10 - 40
                for (var x = 45; x < 130; x++) {
                    for (var y = 5; y < 25; y++) {
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
                    console.log('Loading module results: ' + c);
                    if (c.includes('Cannedmg') == false) {
                        setTimeout(() => {
                            console.log('No loading');
                            resolve('ok');
                        }, 5000)
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
}