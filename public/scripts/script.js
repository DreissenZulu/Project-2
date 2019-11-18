let warning = 0;
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
        currUser = {
            id: "",
            userName: "",
            firstName: "",
            lastName: "",
            confirmLogin: false
        };
        localStorage.setItem("currUser", JSON.stringify(currUser))
    }
    $("#nav-placeholder").load("nav.html", () => {
        if (currUser.confirmLogin) {
            $(".navbar-brand").first().attr("href", "/dashboard")
            $("#navItems").html(`
            <li class="nav-item"><a class="nav-link" href="/dashboard">${currUser.firstName}'s Page</a></li>
            <li class="nav-item"><a class="nav-link" id="logOut" href="#">Log Out</a></li>
            `)
            $("#logOut").click(() => {
                event.stopPropagation();
                if (currUser.confirmLogin) {
                    submitLogOut();
                }
            })
        } else {
            $("#navItems").html(`
            <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/signup">Sign Up</a></li>
            <li class="nav-item"><a class="nav-link" href="/login">Log in</a></li>
            `)
        }
        $("#logOut").click(() => {
            console.log("Clicked!")
            if (currUser.confirmLogin) {
                submitLogOut();
            }
        })
    });
});

function populateSongResults(lastFMResponse) {
    for (item of lastFMResponse) {
        $("#searchResults").append(`
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6 results">
            <img src="${item.images[3]}" alt="">
            <a href="/track?=${item.artistName}?=${item.name}"><h4>${item.name}</h4></a>
            <p>${item.artistName}</p>
        </div>
        `)
    }
}

function populateAlbumResults(lastFMResponse) {
    for (item of lastFMResponse) {
        $("#searchResults").append(`
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6 results">
            <img src="${item.images[3]}" alt="">
            <a href="/album?=${item.artistName}?=${item.name}"><h4>${item.name}</h4></a>
            <p>${item.artistName}</p>
        </div>
        `)
    }
}

// async function populateArtistResults(lastFMResponse) {
//     for (item of lastFMResponse) {
//         let currArtist = encodeURIComponent(item.name);
//         let imgHTML;
//         let queryURL = `https://rest.bandsintown.com/artists/${currArtist}?app_id=codingbootcamp`;
//         // the callback response is technically a promise returned. Put an await before the call to use this properly
//         await $.get(queryURL, (response) => {
//             imgHTML = `<img src="${response.thumb_url}"/>`
//             $("#searchResults").append(`
//             <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6 results">
//                 ${imgHTML}
//                 <h4>${item.name}</h4>
//             </div>
//             `);
//         });
//     }
// }

async function populatePlaylistResults(dbResponse) {
    console.log(dbResponse)
    for (item of dbResponse) {
        $("#searchResults").append(`
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6 results">
            <a href="/playlist?=${item.id}"><h4>${item.playlist_name}</h4></a>
            <p>Genre: ${item.playlist_genre}</p>
        </div>
        `)
    }
}

// API Calls
async function suggestSearch(query, type) {
    return $.ajax({
        url: `/last-fm/search/${query}/${type}`,
        method: "GET"
    });
}

async function suggestPlaylist(query) {
    return $.ajax({
        url: `/playlists/search/${query}`,
        method: "GET"
    });
}

function submitNewUser(data) {
    return $.ajax({
        url: "/api/users",
        data: data,
        method: "POST",
        success: (result) => {
            if (result == "failed") {
                clearTimeout(warning);
                $("#alertTaken").attr('style', 'display:block;')
                warning = setTimeout(() => {
                    $("#alertTaken").attr('style', 'display:none;')
                }, 3000)
                return;
            } else {
                window.location.replace("/login")
            }
        }
    });
}

function submitLoginAttempt(data) {
    return $.ajax({
        url: "/api/users",
        data: data,
        method: "PUT",
        success: (data) => {
            if (data == "failed") {
                clearTimeout(warning);
                $("#alertFailed").attr('style', 'display:block;')
                warning = setTimeout(() => {
                    $("#alertFailed").attr('style', 'display:none;')
                }, 3000)
                return;
            } else {
                localStorage.setItem("currUser", JSON.stringify(data));
                window.location.replace("/dashboard")
            }
        }
    });
}

function submitLogOut() {
    return $.ajax({
        url: `/api/users/${currUser.id}`,
        method: "PUT",
        success: (data) => {
            localStorage.setItem("currUser", JSON.stringify(data));
            window.location.replace("/")
        }
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

    for (inputs of userVals) {
        if (inputs == "") {
            clearTimeout(warning);
            $("#alertFailed").attr('style', 'display:block;')
            warning = setTimeout(() => {
                $("#alertFailed").attr('style', 'display:none;')
            }, 3000)
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

// Removed because it's kind of redundant
// $("#allSearch").click(async () => {
//     let searchQuery = $("#search-bar").val();
//     if (searchQuery == "") {
//         return;
//     }
//     let results = await suggestSearch(encodeURIComponent(searchQuery), "");
//     let playlists = await suggestPlaylist(encodeURIComponent(searchQuery));
//     let topHTML;
//     $("#searchResults").html(``)
//     if (results.topResult == null) {
//         $("#searchResults").append(`
//         <p>Nothing Found :c<p>
//     `)
//         return;
//     }
//     if (results.topResult.type == "track") {
//         topHTML = `
//         <img src="${results.topResult.images[3]}" alt="">
//         <h4>${results.topResult.name}</h4>
//         <p>${results.topResult.artistName}</p>`
//     } else if (results.topResult.type == "artist") {
//         topHTML = `
//         <img src="${results.topResult.images[3]}" alt="">
//         <h4>${results.topResult.name}</h4>`
//     } else if (results.topResult.type == "album") {
//         topHTML = `
//         <img src="${item.images[3]}" alt="">
//         <h4>${item.name}</h4>
//         <p>${item.artistName}</p>`
//     }
//     $("#searchResults").append(`
//         <div>
//             ${topHTML}
//         </div>
//     `)
//     populateSongResults(results.songMatch)
//     populatePlaylistResults(playlists)
//     populateAlbumResults(results.albumMatch)
// })

$("#songSearch").click(async () => {
    let searchQuery = $("#search-bar").val();
    if (searchQuery == "") {
        return;
    }
    let results = await suggestSearch(encodeURIComponent(searchQuery), "song");
    $("#searchResults").html(``)
    populateSongResults(results)
})

// $("#artistSearch").click(async () => {
//     let searchQuery = $("#search-bar").val();
//     if (searchQuery == "") {
//         return;
//     }
//     let results = await suggestSearch(encodeURIComponent(searchQuery), "artist");
//     $("#searchResults").html(``)
//     populateArtistResults(results)
// })

$("#playlistSearch").click(async () => {
    let searchQuery = $("#search-bar").val();
    if (searchQuery == "") {
        return;
    }
    let results = await suggestPlaylist(encodeURIComponent(searchQuery));
    $("#searchResults").html(``)
    populatePlaylistResults(results)
})

$("#albumSearch").click(async () => {
    let searchQuery = $("#search-bar").val();
    if (searchQuery == "") {
        return;
    }
    let results = await suggestSearch(encodeURIComponent(searchQuery), "album");
    $("#searchResults").html(``)
    populateAlbumResults(results)
})

// Search function delays the query to last-fm for 0.7 seconds so a search for every new letter isn't launched
$("#search-bar").keypress(() => {
    if (event.which == '13') {
        event.preventDefault();
    }
})

$(".show").click(function () {
    if ($("#show-content").hasClass("hide")) {
        $("#show-content").slideToggle(500);
        $("#show-content").removeClass('hide');
        $("#show-content").addClass('show');
        $(".arrow").attr('src', './assets/images/up-arrow.png');
    } else {
        $("#show-content").slideToggle(500, function () {
            $("#show-content").removeClass('show');
            $("#show-content").addClass('hide');
            $(".arrow").attr('src', './assets/images/down-arrow.png');
        });
    }
});

$("#hover").hover(function () {
    console.log('lourd');
});