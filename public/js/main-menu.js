
$( document ).ready(function() {
    setup_radio_selection_clicks();

});

function setup_radio_selection_clicks() {
    $("#layout-standard").click(function() {
        $( "#img-layout-select-standard" ).show( "fast" );
        $( "#img-layout-select-german" ).hide( "fast" );
        $( "#img-layout-select-belgium" ).hide( "fast" );
    });
    $("#layout-german").click(function() {
        $( "#img-layout-select-standard" ).hide( "fast" );
        $( "#img-layout-select-german" ).show( "fast" );
        $( "#img-layout-select-belgium" ).hide( "fast" );
    });
    $("#layout-belgium").click(function() {
        $( "#img-layout-select-standard" ).hide( "fast" );
        $( "#img-layout-select-german" ).hide( "fast" );
        $( "#img-layout-select-belgium" ).show( "fast" );
    });

    $("#color-black").click(function() {
        $(".layout-preview").css({'transform' : 'rotate(0deg)'});
    });
    $("#color-white").click(function() {
        $(".layout-preview").css({'transform' : 'rotate(180deg)'});
    });
}