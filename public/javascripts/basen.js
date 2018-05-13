window.onload = function() {
    var add = $('#addform')
    var liczbaOs = 0;
    add.hide();
    $('#operator')[0].value = 'Krysia';

    $('.tab-liczba').each((row) => {
        liczbaOs += parseInt($('.tab-liczba')[row].innerText)
    });

    $('#liczba-os')[0].innerText = 'Liczba Osob na basenie: ' + liczbaOs;
    
    $('#addbtn').on('click', () => {
        add.toggle();
    })
}