$('button.link').on('click', function() {
    var win = window.open($(this).attr('href'));
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }
});