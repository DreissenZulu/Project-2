function getAlbumInfo(artist, album) {
    return $.ajax({
        url: `/lastfm/${artist}/${album}`,
        method: "GET",
        success: (album) => {
            console.log(album);
        }
    })
}

$(document).ready(() => {
    let albumQuery = self.location.search.split(/\?=/g)
    getAlbumInfo(albumQuery[1], albumQuery[2]);
})