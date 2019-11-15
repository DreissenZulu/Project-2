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
            if (currUser.id == data.playlist[0].user_id) {
                for (song of data.songs) {
                    listNum++;
                    $("#songList").append(`
                        <tr>
                        <th scope="row">${listNum}</th>
                        <td><a href="/track?=${song.artist}?=${song.song}">${song.song}</a></td>
                        <td>${song.artist}</td>
                        <td align="center"><a href="#" id="${song.id}" class="song-remove"><img src="assets/images/clear.png" class="remove"></a></td>
                        </tr>
                    `)
                }
                // Removal function is only available to the user if they're logged in AND the playlist belongs to them
                $(".song-remove").click((event) => {
                    event.stopPropagation();
                    let songText = $(event.currentTarget).parent().siblings()[1].innerText;
                    let songID = $(event.currentTarget).attr('id');
                    stageSong(songID, songText);
                    $("#myModal").modal()
                })
            } else {
                for (song of data.songs) {
                    listNum++;
                    $("#songList").append(`
                        <tr>
                        <th scope="row">${listNum}</th>
                        <td><a href="/track?=${song.artist}?=${song.song}">${song.song}</a></td>
                        <td>${song.artist}</td>
                        <td></td>
                        </tr>
                    `)
                }
            }
        }
    });
}

function stageSong(id, title) {
    $("#modal-playlist").html(`Do you really want to remove <strong> ${title} </strong>from your playlist ?`)
    $("#confirm").attr('value', id);
}

function removeSong(playlistID, songID) {
    return $.ajax({
        url: `/api/playlists/${playlistID}/${songID}`,
        method: "DELETE",
        data: currUser,
        success: () => {
            $("#songList").html("");
            let playlistQuery = self.location.search.split(/={1}/g)
            populatePlaylist(playlistQuery[1]);
        }
    });
}

$("#confirm").click((event) => {
    let songID = $(event.currentTarget).attr('value');
    let playlistID = self.location.search.split(/={1}/g)[1]
    removeSong(playlistID, songID);
})

$(document).ready(function () {
    let playlistQuery = self.location.search.split(/={1}/g)
    populatePlaylist(playlistQuery[1]);
})