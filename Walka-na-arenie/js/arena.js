$(document).ready(function () {
    log('Witaj');
    $('#button-attack').click(function(){
        playerAttack();
        npcAttack();
        licznik += 1;  
        if(licznik == 5)    {
        clearLog();
        return licznik = 0;
        };
    });
});

var licznik = 0;
var clearLog = function()   {
        $('#okienko').html('');
}

var log = function(log) {
    $('#okienko').append('<p>' + log + '</p>').fadeIn('slow', 1000);
}

var player = new Object(); {
    player.name = 'Bruce Willis',
    player.hp = 100;
    player.armor = 2;
    player.stamina = 100;
    
    player.hit = function() {
        var ifHit = Math.floor(Math.random() * 2) == 1;
        if(ifHit == true) {
            player.stamina -= 10;
        }   else    {
            player.stamina -= 5;
        } 
        return ifHit;
    };

    player.damage = function() {
        return Math.floor(Math.random() * 33);
    }
};

var npc = function(name, hp, armor, stamina){
    this.name = name;
    this.hp = hp;
    this.armor = armor;
    this.stamina = stamina;
    
    this.hit = function() {
        return Math.floor(Math.random() * 3) == 2;
    }

    this.damage = function() {
        return Math.floor(Math.random() * 22);
    }
};

var npc1 = new npc('John', 100, 0, 80);
var npc2 = new npc('Gerald', 100, 2, 100);

//var fight = true;

var playerAttack = function() {
    if(player.hit() == true) {
        var ileDmg = player.damage();
        npc.hp -= ileDmg; 
        log('Zadales ' + ileDmg + ' ' + 'demejdza')
    //return log(ileDmg); // Pokazuje ile dmg zadal Player

}   else    {
        return log('miss');
    }
}

//var npcPick = function() {

//}

var npcAttack = function() {
    if(npc1.hit() == true) {
        var ileDmg = npc1.damage();
        player.hp -= ileDmg;
        log(npc1.name + ' zadal tobie ' + ileDmg + ' demejdza');
    return log(ileDmg); // Pokazuje ile dmg zadal Npc
    } else {
        return log(npc1.name + ' ' + 'miss');
    }
};

var playerDefend = function(){

}

var exhaustPlayer = function(){
    if(hit == true) {
        player.stamina -= -10; 
    }
}

var exhaustNpc = function() { 
    if(hitNPC == true) {
        npc.stamina -= -10; // Zabiera stamine obydwu npc ?
    }
}

var duel = function(){
    while(fight) {

    }
}