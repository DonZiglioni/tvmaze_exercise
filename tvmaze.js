"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const rootURL = 'https://api.tvmaze.com'

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

let showID;

async function getShowsByTerm(term) {
  const res = await axios.get(rootURL + `/search/shows?q=` + term)
  return res.data
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  let imageURL

  if (shows[0].show.image) {
    imageURL = shows[0].show.image.original
  } else {
    imageURL = 'https://tinyurl.com/tv-missing'
  }

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${imageURL}
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes" onClick="getEpisodesOfShow(${show.show.id})">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  console.log(id);
  const res = await axios.get(rootURL + `/shows/` + id + `/episodes`)
  populateEpisodes(res.data)
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesArea.show()
  console.log(episodes);
  for (let episode of episodes) {
    const $episode = $(
      `<li>${episode.name} (Season: ${episode.season}: Episode: ${episode.number})</li>
      `);
    $episodesArea.append($episode);
  }
}
