$(".added").click(function () {
    $(".alert").removeClass("hide");
    setTimeout(function () {
        $(".alert").addClass("hide");
    }, 2500);
});


$(window).resize(function () {
if ($(window).width() < 480) {
    $('nav').addClass('row')
    $('body > header > nav > a').addClass('col-sm-12')
    $('body > header > nav > ul').css('margin', '0 auto')
} else {
    $('nav').removeClass('row')
    $('body > header > nav > a').removeClass('col-sm-12')
    $('body > header > nav > ul').css('margin', '')
}
});