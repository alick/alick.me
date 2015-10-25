$(document).ready(function() {
    var path = window.location.pathname.toLowerCase();
    $('.nav a[href="' + path + '"]').parent().addClass('active');
});
