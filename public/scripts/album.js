async function getAlbumInfo(artist, album) {
    await $.ajax({
        url: `/lastfm/${artist}/${album}`,
        method: "GET"
    }).then((response) => {
        let albumInfo = response.album;
        let albumImage = albumInfo.image[3];
        let albumGenre = albumInfo.tags.tag[0].name == 'albums I own' ? albumInfo.tags.tag[1].name : albumInfo.tags.tag[0].name;
        let albumPublished = albumInfo.wiki.published.split(",")[0]
        let currTrack = 0;

        $("title").text(`${albumInfo.name} - ${albumInfo.artist}`)

        $(".album-cover").first().attr('src', Object.values(albumImage)[0])
        $("#albumInfo").html(`
            <h1 class="album-name">${albumInfo.name}</h1>
            <h3 class="artist-name">by <i class="artist">${albumInfo.artist}</i></h3>
            <h4 class="genre">${albumGenre}</h4>
            <h4 class="release-date">${albumPublished}</h4>
            <p class="song-description">${albumInfo.wiki.summary}</p>
        `)

        for (track of Object.values(albumInfo.tracks)[0]) {
            let trackMinutes = Math.floor(track.duration / 60);
            let trackSeconds = String(track.duration % 60).padStart(2, '0');
            currTrack++;

            $("#albumSongs").append(`
                <tr>
                <th scope="row">${currTrack}</th>
                <td>${track.name}</td>
                <td>${trackMinutes}:${trackSeconds}</td>
                <td align="center"><a href="#" data-toggle="modal" data-target="#myModal"><img src="assets/images/add.png" class="add"></a></td>
                </tr>
            `)
        }
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
                <a href="#" class="added list-group-item list-group-item-action">${list.playlist_name}</a>
                `)
            }
        }
    })
}

$(document).ready(() => {
    let albumQuery = self.location.search.split(/\?=/g)
    getAlbumInfo(albumQuery[1], albumQuery[2]);
    getMyPlaylists(currUser.id);
})