window.onload = function() {
    var add = $('#addform')
    var liczbaOs = 0;
    
    if ($('#clock').length > 0) {
        setInterval(function() {
            var d = new Date();
            $('#clock').html(d.toLocaleTimeString());
		}, 1000);		
	};

    $('#operator')[0].value = 'Krysia';

    $('.tab-liczba').each((row) => {
        liczbaOs += parseInt($('.tab-liczba')[row].innerText)
    });

    $('#czy_hotelowy').on({
        change: function (e) {
            if($('#hotelowy-sel')[0].selected == true) {
                $('#numer-pokoju').removeClass('invis');
            } else {
                $('#numer-pokoju').addClass('invis');
            }
        }
    });

    $('.idklient').each(function(item) {
        console.log($(this).text());
        $('#klientid').append($('<option>', {value: $(this).text(), text: $(this).text() + ' Pokoj numer: ' + $('.numer-pokoju')[item].innerText}))
    });

    $('#register').on({
        click: function() {
            if($('#hotelowy-sel')[0].selected == false) {                
                $('#numer-pokoju')[0].type = 'text';
                $('#numer-pokoju')[0].value = 'Gość Zewnętrzny';
            }
        }
    })

    $('#liczba-os')[0].innerText = 'Liczba Osob na basenie: ' + liczbaOs;
    
    $('#addbtn').on('click', () => {
        add.toggleClass('add-client');
    })
}