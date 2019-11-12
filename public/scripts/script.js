let currUser;
if (localStorage.getItem("currentUser")) {
    currUser = JSON.parse(localStorage.getItem("currentUser"))
} else {
    currUser = {};
}

$(".added").click(function () {
    $('#myModal').modal('hide')
    $(".alert").removeClass("hide");
    setTimeout(function () {
        $(".alert").addClass("hide");
    }, 2500);
});


$(document).keydown(function (e) {
    if (e.keyCode === 27) {
        $("#myModal").modal('hide')
    }
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

var mq = window.matchMedia("(max-width: 480px)");
if (mq.matches) {
    $('nav').addClass('row')
    $('body > header > nav > a').addClass('col-sm-12')
    $('body > header > nav > ul').css('margin', '0 auto')
} else {
    $('nav').removeClass('row')
    $('body > header > nav > a').removeClass('col-sm-12')
    $('body > header > nav > ul').css('margin', '')
}

$(document).ready(function () {
    $("#nav-placeholder").load("nav.html");
});

function submitNewUser(data) {
    return $.ajax({
        url: "/api/users",
        data: data,
        method: "POST"
    });
}

function submitLoginAttempt(data) {
    return $.ajax({
        url: "/api/users",
        data: data,
        method: "PUT"
    });
}

// API Calls
$("#createNewAccount").click(() => {
    event.preventDefault();
    let userInfo = {
        username: $("#user").val().trim(),
        firstName: $("#first-name").val().trim(),
        lastName: $("#last-name").val().trim(),
        password: $("#password").val().trim()
    }
    let userVals = Object.values(userInfo);

    for(inputs of userVals) {
        if (inputs == "") {
            console.log("Missing information!!");
            return;
        }
    }
    submitNewUser(userInfo);
});

$("#attemptLogin").click(() => {
    event.preventDefault();
    let userInfo = {
        username: $("#user").val().trim(),
        password: $("#password").val().trim()
    }
    submitLoginAttempt(userInfo);
})