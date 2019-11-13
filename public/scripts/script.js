let userTyping = 0;
let currUser;

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
    if (localStorage.getItem("currUser")) {
        currUser = JSON.parse(localStorage.getItem("currUser"))
    } else {
        currUser = {};
    }
    $("#nav-placeholder").load("nav.html");
});

// API Calls
function checkLogin() {
    if (currUser.confirmLogin) {
        
    }
}

function suggestSearch(query, type) {
    return $.ajax({
        url: `/last-fm/search/${query}/${type}`,
        method: "GET",
        success: (data) => {
            console.log(data)
        }
    });
}

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
        method: "PUT",
        success: (data) => {
            localStorage.setItem("currUser", JSON.stringify(data));
            window.location.replace("indexlogged.html")
        }
    });
}

function createPlaylist(data) {
    return $.ajax({
        url: "/api/playlists",
        data: data,
        method: "POST"
    })
}

function addComment(data, location, id) {
    return $.ajax({
        url: `/api/comments/${location}/${id}`,
        data: data,
        method: "POST"
    })
}

// Functions to API calls
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

// Submits user input to the server, which will attempt to find a matching account
$("#attemptLogin").click(() => {
    event.preventDefault();
    let userInfo = {
        username: $("#user").val().trim(),
        password: $("#password").val().trim()
    }
    submitLoginAttempt(userInfo);
})

$("#playlistCreate").click(() => {
    if (currUser.userName == "") {
        console.log("Please log in to create a playlist.");
        return;
    }
    let playlistInfo = {
        creatorID: currUser.id,
        playlistName: $("#title").val().trim(),
        playlistDesc: $("#description").val().trim(),
        playlistGenre: $("#genre").val()
    }
    createPlaylist(playlistInfo);
})

$("#submitComment").click(() => {
    if ($("#commentBody").val().trim() == "") {
        return;
    }
    let commentDestination;
    let commentPath;
    if ($("#mbid").val() != undefined) {
        commentDestination = $("#mbid").val();
        commentPath = "mbid";
    } else {
        commentDestination = $("#playlistID").val();
        commentPath = "playlist";
    }
    let commentInfo = {
        commenterID: currUser.id,
        comment: $("#commentBody").val().trim()
    }
    addComment(commentInfo, commentPath, commentDestination);
})

// Search function delays the query to last-fm for 0.7 seconds so a search for every new letter isn't launched
$("#search-bar").keypress(() => {
    clearTimeout(userTyping);
    userTyping = setTimeout(() => {
        let searchQuery = $("#search-bar").val().split(/:\s?/i)
        if (searchQuery.length == 1) {
            suggestSearch(searchQuery[0], "");
        } else {
            suggestSearch(searchQuery[1], searchQuery[0]);
        }
    }, 700);
})