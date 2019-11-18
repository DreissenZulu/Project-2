# Rice eaters(temporary name)

**A social music app to create and share your playlists.**
Users can search for music and albums from around the world, read information about them, the date of release, and the genre (retrieved from Last FM), and add songs to playlists users can create. Users can comment on existing playlists, or add playlists they don't own to their favourites by "liking" them.

---

**Third Party Technologies Used:**

- Bootstrap
- Lastfm API (using the LastFM npm package)
- BandInTown API (not used in the deployed build)
- Youtube API

---

***Icon Resource***

www.flaticon.com

---

## Approach
Starting the project, we began with a simple user story:

    As a music lover, I want a place to find and organize my favourite songs, look for lists of songs with music I like, and communicate with like-minded audiophiles.

With this objective in mind, we divided the project into two parts.

### 1. Front-End
The front end of the application was designed to be sleek, minimal, and easy to navigate. Users can easily search for songs, albums, and playlists right from the landing page, and the navigation bar directs them to the sign up page or the login page. On logging into the site, users are redirected to their dashboard, where they can manage and add playlists or search.

When users search for an album, the page directs you to a page which displays all the songs in that album. Users can add songs to their playlists if they're logged in. If a user clicks on a song, it will direct the user to that song's page, which will provide more details of that song, as well as provide a link to listen to the song on YouTube.

The playlist page will show all the songs a user added, but will also allow them to remove the song from that playlist. Users can post a comment to any existing playlist and can add playlists they don't own to their list of favourites.

### 2. Back-End
The back end requires a database to store user login info, playlist information, songs saved, and comments. In proper MVC structure the back end requires the server, the database connection, an ORM, a model, a controller, and the front-end Javascript which interacts with the controller.

## Challenges
We found initially that developing the front end and back end components required was simple thanks to our clear objective and development roadmap outlined on Trello. It was when we had to put everything together that development began to struggle.

The back end found some struggle in that many of the components required front end interaction to test. In place of this, we used Node's inquirer to perform back end only testing. We also found some struggle in defining routes for the controller, specifically in defining routes with similar urls. We found eventually that routes with specific sections needed to be defined first, else they would be mistaken as a paramenter for another route.

Additionally, once connecting the backend to the frontend began, it quickly became apparent that we needed to implement asynchronicity to the calls to the database. The problem was understanding where and when to define an asynchronous function to allow the code to wait properly before continuing its operations. Finding a way to pass parameters from the front end to the back end when the page was changed was also difficult. As the application has a multi-page structure, we needed a way to give the Javascript information that is not saved to the database or to local storage. The solution was simply to use query strings in the url.

Another challenge faced was in properly integrating the LastFM API. While most entries shared similar formatting, we found that some indie songs or foreign songs were missing key information required in the application structure. This required implementing error checking in the front end to handle missing information.

**Future Considerations:**

- Connect your Spotify/Deezer/Itunes to import your playlists to the app

- Add more informations for instance on a song page get the lyrics with the Genius API

- Be able to share your playlist on the social media 

- Track your playlist popularity, know how many people save your playlist

---

**Get Involved!**

- Link to GitHub repo: https://github.com/DreissenZulu/Project-2
- Link to deployed Heroku: https://agile-cove-03002.herokuapp.com/

---

**Thank you!**

*Sincerely, Alex and Billy*

