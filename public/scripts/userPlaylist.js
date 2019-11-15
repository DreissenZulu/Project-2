let selectSong;

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
                $(".modal-content").first().html(`
                    <div class="modal-body">
                    <p id="modal-playlist">Do you really want to remove <strong> "Your Song" </strong>from your playlist ?</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success rounded-0" data-dismiss="modal" id="confirm">Confirm</button>
                        <button class="btn btn-danger rounded-0" data-dismiss="modal">Cancel</button>
                    </div>
                `)
                // Removal function is only available to the user if they're logged in AND the playlist belongs to them
                $(".song-remove").click((event) => {
                    event.stopPropagation();
                    let songText = $(event.currentTarget).parent().siblings()[1].innerText;
                    let songID = $(event.currentTarget).attr('id');
                    stageSong(songID, songText);
                    $("#myModal").modal()
                })
                $("#confirm").click((event) => {
                    let songID = $(event.currentTarget).attr('value');
                    let playlistID = self.location.search.split(/={1}/g)[1]
                    removeSong(playlistID, songID);
                })
            } else {
                for (song of data.songs) {
                    listNum++;
                    $("#songList").append(`
                        <tr>
                        <th scope="row">${listNum}</th>
                        <td class="title"><a href="/track?=${song.artist}?=${song.song}">${song.song}</a></td>
                        <td class="artist">${song.artist}</td>
                        <td align="center"><a href="#" class="add-song"><img src="assets/images/add.png" class="add"></a></td>
                        </tr>
                    `)
                }
                $(".modal-content").first().html(`
                    <div class="modal-header">
                    <h1>Add to your playlist</h1>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <div class="list-group">
                                    <a href="/login" style="margin: auto;">Log in to add this song to your playlist!</a>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-danger rounded-0" data-dismiss="modal">Cancel</button>
                    </div>
                `)
                $(".add-song").click((event) => {
                    event.stopPropagation();
                    selectSong = {
                        songTitle: $(event.currentTarget).parent().siblings('.title').text(),
                        artistName: $(event.currentTarget).parent().siblings('.artist').text()
                    }
                    $("#myModal").modal()
                })
                getMyPlaylists(currUser.id);
            }
        }
    });
}

function getMyPlaylists(id) {
    return $.ajax({
        url: `/playlists/${id}`,
        method: "GET",
        success: (playlists) => {
            $(".list-group").first().html("")
            for (list of playlists) {
                $(".list-group").first().append(`
                <a href="#" class="added list-group-item list-group-item-action" id="${list.id}">${list.playlist_name}</a>
                `)
            }
            $(".added").click((event) => {
                let playlistID = $(event.currentTarget).attr('id');
                addSong(playlistID, selectSong)
            })
        }
    })
}

function stageSong(id, title) {
    $("#modal-playlist").html(`Do you really want to remove <strong> ${title} </strong>from your playlist ?`)
    $("#confirm").attr('value', id);
}

function addSong(playlistID, songInfo) {
    return $.ajax({
        url: `/api/playlists/${playlistID}`,
        data: songInfo,
        method: "POST",
        success: () => {
            $("#myModal").modal('hide')
        }
    });
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

$(document).ready(function () {
    let playlistQuery = self.location.search.split(/={1}/g)
    populatePlaylist(playlistQuery[1]);
})