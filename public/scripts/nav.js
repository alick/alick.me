/**
 *
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2021 Alick Zhao
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */
$(document).ready(function() {
    var path = window.location.pathname.toLowerCase();
    // Strip out possible leading slash and lang code (e.g. /, /zh_CN/)
    path = path.replace(/\/(\w{2}(_\w+)?\/)?/, '');
    $('.nav a[href="' + path + '"]').parent().addClass('active');
    
    // Theme toggle functionality
    var themeToggle = $('#theme-toggle');
    var themeIcon = $('#theme-icon');
    var html = $('html');
    var navbar = $('#main-navbar');
    
    // Check for saved theme preference or default to light
    var currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        html.attr('data-theme', 'dark');
        themeIcon.text('☀️');
        navbar.removeClass('navbar-default').addClass('navbar-inverse');
    }
    
    // Theme toggle click handler
    themeToggle.on('click', function(e) {
        e.preventDefault();
        
        if (html.attr('data-theme') === 'dark') {
            // Switch to light theme
            html.removeAttr('data-theme');
            themeIcon.text('🌙');
            localStorage.setItem('theme', 'light');
            navbar.removeClass('navbar-inverse').addClass('navbar-default');
        } else {
            // Switch to dark theme
            html.attr('data-theme', 'dark');
            themeIcon.text('☀️');
            localStorage.setItem('theme', 'dark');
            navbar.removeClass('navbar-default').addClass('navbar-inverse');
        }
    });
});
