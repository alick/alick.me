$(document).ready(function(){
    $('.bibbtn').on('click', function(){
        $(this).parent().next().toggleClass('noshow');
    });
    $('.bib').filter(function(){
        if (true === /journal\s+=\s+IEEE_/.test($(this).text())) {
            $(this).attr('title', 'Use with IEEEabrv.bib');
        }
    });
});
