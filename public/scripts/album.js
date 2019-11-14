async function getAlbumInfo(artist, album) {
        await $.ajax({
            url: `/lastfm/${artist}/${album}`,
            method: "GET"
        }).then((response) => {
            let albumInfo = response.album;
            let albumImage = albumInfo.image[3];
            let albumGenre = albumInfo.tags.tag[0].name == 'albums I own' ? albumInfo.tags.tag[1].name : albumInfo.tags.tag[0].name
            $(".album-cover").first().attr('src', Object.values(albumImage)[0])
            $("#albumInfo").html(`
                <h1 class="album-name">${albumInfo.name}</h1>
                <h3 class="artist-name">by <i class="artist">${albumInfo.artist}</i></h3>
                <h4 class="genre">${albumGenre}</h4>
                <h4 class="release-date">${albumInfo.wiki.published}</h4>
                <p class="song-description">${albumInfo.wiki.summary}</p>
            `)
        })
}

$(document).ready(() => {
    let albumQuery = self.location.search.split(/\?=/g)
    getAlbumInfo(albumQuery[1], albumQuery[2]);
})