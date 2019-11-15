let selectSong;

async function getAlbumInfo(artist, album) {
    await $.ajax({
        url: `/lastfm/album/${artist}/${album}`,
        method: "GET"
    }).then((response) => {
        let albumInfo = response.album;
        let albumImage = albumInfo.image[3];
        let albumGenre = albumInfo.tags.tag[0].name == 'albums I own' ? albumInfo.tags.tag[1].name : albumInfo.tags.tag[0].name;
        let albumPublished = albumInfo.wiki ? albumInfo.wiki.published.split(",")[0] : "Unknown";
        let albumSummary = albumInfo.wiki ? albumInfo.wiki.summary : "No summary available.";
        let currTrack = 0;

        $("title").text(`${albumInfo.name} - ${albumInfo.artist}`)
        $(".album-cover").first().attr('src', Object.values(albumImage)[0])
        $("#albumInfo").html(`
            <h1 class="album-name">${albumInfo.name}</h1>
            <h3 class="artist-name">by <i class="artist">${albumInfo.artist}</i></h3>
            <h4 class="genre">${albumGenre}</h4>
            <h4 class="release-date">${albumPublished}</h4>
            <p class="song-description">${albumSummary}</p>
        `)

        for (track of Object.values(albumInfo.tracks)[0]) {
            let trackMinutes = Math.floor(track.duration / 60);
            let trackSeconds = String(track.duration % 60).padStart(2, '0');
            currTrack++;
            $("#albumSongs").append(`
                <tr>
                <th scope="row">${currTrack}</th>
                <td class="title"><a href="/track?=${albumInfo.artist}?=${track.name}">${track.name}</a></td>
                <td>${trackMinutes}:${trackSeconds}</td>
                <td align="center"><a href="#" class="add-song"><img src="assets/images/add.png" class="add"></a></td>
                </tr>
            `)
        }
        $(".add-song").click((event) => {
            event.stopPropagation();
            selectSong = {
                songTitle: $(event.currentTarget).parent().siblings('.title').text(),
                artistName: $(".artist").first().text()
            }
            $("#myModal").modal()
        })
    })
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

$(document).ready(() => {
    let albumQuery = self.location.search.split(/\?=/g)
    getAlbumInfo(decodeURIComponent(albumQuery[1]), decodeURIComponent(albumQuery[2]));
    getMyPlaylists(currUser.id);
})