let selectSong;

async function getSongInfo(artist, track) {
    await $.ajax({
        url: `/lastfm/song/${artist}/${track}`,
        method: "GET"
    }).then((response) => {
        console.log(response)
        let trackInfo = response.track;
        let trackImage = trackInfo.album.image[3];
        let trackGenre = trackInfo.toptags.tag[0].name == 'albums I own' ? trackInfo.toptags.tag[1].name : trackInfo.toptags.tag[0].name;
        let trackPublished = trackInfo.wiki ? trackInfo.wiki.published.split(",")[0] : "Unknown";
        let trackSummary = trackInfo.wiki ? trackInfo.wiki.summary : "No summary available.";
        selectSong = {
            songTitle: trackInfo.name,
            artistName: trackInfo.artist.name
        }

        $("title").text(`${trackInfo.name} - ${trackInfo.artist.name}`)
        $(".album-cover").first().attr('src', Object.values(trackImage)[0])
        $(".song-name").first().text(trackInfo.name);
        $(".artist").first().text(trackInfo.artist.name);
        $(".genre").first().text(trackGenre);
        $(".release-date").first().text(trackPublished);
        $(".song-description").first().html(trackSummary);
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
    let trackQuery = self.location.search.split(/\?=/g)
    getSongInfo(trackQuery[1], trackQuery[2]);
    getMyPlaylists(currUser.id);
})