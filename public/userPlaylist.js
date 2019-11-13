function populatePlaylist(id) {
    return $.ajax({
        url: `/playlist/${id}`,
        method: "GET",
        success: (data) => {
            let listNum = 0;
            let dateCreated = data.playlist[0].createdAt.split(/[a-zA-Z]/g)[0]
            $(".playlist-name").first().text(data.playlist[0].playlist_name);
            $(".user").first().text(data.playlist[0].userName);
            $(".genre").first().text(data.playlist[0].playlist_genre);
            $(".create-date").first().text(dateCreated);
            $(".playlist-description").first().text(data.playlist[0].playlist_description);
            for(song of data.songs) {
                listNum++;
                $("#songList").append(`
                    <tr>
                    <th scope="row">${listNum}</th>
                    <td>${song.song}</td>
                    <td>${song.artist}</td>
                    <td align="center"><a href="#" data-toggle="modal" data-target="#myModal"><img src="assets/images/clear.png" class="remove"></a></td>
                    </tr>
                `)
            }
        }
    });
}

$(document).ready(function () {
    let playlistQuery = self.location.search.split(/={1}/g)
    populatePlaylist(playlistQuery[1]);
    if (localStorage.getItem("currUser")) {
        currUser = JSON.parse(localStorage.getItem("currUser"))
    } else {
        currUser = {};
    }
    $("#nav-placeholder").load("nav.html", () => {
        if (currUser.confirmLogin) {
            $("#navItems").html(`
            <li class="nav-item"><a class="nav-link" href="/dashboard">My Page</a></li>
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
})