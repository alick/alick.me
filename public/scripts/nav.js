$(document).ready(function() {
    var path = window.location.pathname.toLowerCase();
    // Strip out possible leading slash and lang code (e.g. /, /zh_CN/)
    path = path.replace(/\/(\w{2}(_\w+)?\/)?/, '');
    $('.nav a[href="' + path + '"]').parent().addClass('active');
});
