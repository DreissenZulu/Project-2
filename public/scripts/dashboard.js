function getMyPlaylists(id) {
    return $.ajax({
        url: `/playlists/${id}`,
        method: "GET",
        success: (playlists) => {
            for (list of playlists) {
                $("#myPlaylists").append(`
                    <li class=""><a href="/playlist?=${list.id}">${list.playlist_name}</a></li>
                `)
            }
        }
    })
}

function createPlaylist(data) {
    return $.ajax({
        url: "/api/playlists",
        data: data,
        method: "POST",
        success: () => {
            location.reload();
        }
    })
}

$("#playlistCreate").click(() => {
    if (currUser.userName == "") {
        console.log("Please log in to create a playlist.");
        return;
    }
    let playlistInfo = {
        creatorID: currUser.id,
        playlistName: $("#newPlaylistName").val().trim(),
        playlistDesc: $("#newPlaylistDesc").val().trim(),
        playlistGenre: $("#newPlaylistGenre").val()
    }
    createPlaylist(playlistInfo);
})

$(document).ready(function () {
    getMyPlaylists(currUser.id);
})