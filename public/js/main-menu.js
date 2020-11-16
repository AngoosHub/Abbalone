
$( document ).ready(function() {
    localStorage.setItem('layout', 0);
    localStorage.setItem('gameMode', 0);
    localStorage.setItem('turnLimit', 50);
    localStorage.setItem('p1TimeLimit', 5);
    localStorage.setItem('p2TimeLimit', 5);
    localStorage.setItem('blackPlayer', 1);
    setup_radio_selection_clicks();
    gameModeSetup();
    setBlackPlayer();
});

function setup_radio_selection_clicks() {
    $("#layout-standard").click(function() {
        $( "#img-layout-select-standard" ).show( "fast" );
        $( "#img-layout-select-german" ).hide( "fast" );
        $( "#img-layout-select-belgium" ).hide( "fast" );
        localStorage.setItem('layout', 0);
    });
    $("#layout-belgium").click(function() {
        $( "#img-layout-select-standard" ).hide( "fast" );
        $( "#img-layout-select-german" ).hide( "fast" );
        $( "#img-layout-select-belgium" ).show( "fast" );
        localStorage.setItem('layout', 1);
    });
    $("#layout-german").click(function() {
        $( "#img-layout-select-standard" ).hide( "fast" );
        $( "#img-layout-select-german" ).show( "fast" );
        $( "#img-layout-select-belgium" ).hide( "fast" );
        localStorage.setItem('layout', 2);
    });

    $("#color-black").click(function() {
        $(".layout-preview").css({'transform' : 'rotate(0deg)'});
    });
    $("#color-white").click(function() {
        $(".layout-preview").css({'transform' : 'rotate(180deg)'});
    });
}

function gameModeSetup() {
    $('#game-mode-player-player').click(function() {
        localStorage.setItem('gameMode', 0)
    });
    $('#game-mode-player-cpu').click(function() {
        localStorage.setItem('gameMode', 1)
        console.log(localStorage.getItem('gameMode'))
    });
    $('#game-mode-cpu-cpu').click(function() {
        localStorage.setItem('gameMode', 2)
    });
}

function turnLimitOnChange() {
    let value = document.getElementById("turn-limit").value;
    localStorage.setItem('turnLimit', value);
}

function p1TimeLimitChange() {
    let value = document.getElementById("time-limit-player1").value;
    localStorage.setItem('p1TimeLimit', value);
}
function p2TimeLimitChange() {
    let value = document.getElementById("time-limit-player2").value;
    localStorage.setItem('p2TimeLimit', value);
}

function setBlackPlayer() {
    $('#color-black').click(function() {
        localStorage.setItem('gameMode', 1);
    });
    $('#color-white').click(function() {
        localStorage.setItem('gameMode', 2);
    });
}