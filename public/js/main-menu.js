
$( document ).ready(function() {
    localStorage.setItem('layout', 0);
    setup_radio_selection_clicks();
});

function setup_radio_selection_clicks() {
    $("#layout-standard").click(function() {
        $( "#img-layout-select-standard" ).show( "fast" );
        $( "#img-layout-select-german" ).hide( "fast" );
        $( "#img-layout-select-belgium" ).hide( "fast" );
        localStorage.setItem('layout', 0);
    });
    $("#layout-german").click(function() {
        $( "#img-layout-select-standard" ).hide( "fast" );
        $( "#img-layout-select-german" ).show( "fast" );
        $( "#img-layout-select-belgium" ).hide( "fast" );
        localStorage.setItem('layout', 1);
    });
    $("#layout-belgium").click(function() {
        $( "#img-layout-select-standard" ).hide( "fast" );
        $( "#img-layout-select-german" ).hide( "fast" );
        $( "#img-layout-select-belgium" ).show( "fast" );
        localStorage.setItem('layout', 2);
    });

    $("#color-black").click(function() {
        $(".layout-preview").css({'transform' : 'rotate(0deg)'});
    });
    $("#color-white").click(function() {
        $(".layout-preview").css({'transform' : 'rotate(180deg)'});
    });
}