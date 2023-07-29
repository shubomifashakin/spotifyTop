//this gets the users profile info
export async function fetchProfile(token) {
  try {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!result.ok) {
      throw new Error(result.status);
    }

    const data = await result.json();
    return data;
  } catch (err) {
    throw err;
  }
}

//this gets the specified amount of top tracks & artists we want fr a specific time range
export async function fetchTop(token, time_range, amount) {
  try {
    const result = await Promise.all([
      fetch(
        `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=${amount}&offset=0`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
      fetch(
        `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=${amount}&offset=0`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    ]);

    if (!result[0].ok && !result[1].ok) {
      throw new Error(
        `Something went wrong ${result[0].status && result[1].status}`
      );
    }

    const [tracks, artists] = result;
    const tracksData = await tracks.json();
    const artistsData = await artists.json();
    // console.log(tracksData);
    return [tracksData, artistsData];
  } catch (err) {
    throw err;
  }
}

export async function similarArtists(token, id) {
  try {
    const result = await fetch(
      `https://api.spotify.com/v1/artists/${id}/related-artists `,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!result.ok) {
      throw new Error(result.status);
    }

    const data = await result.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function similarSongs(token, trackId) {
  try {
    let result;
    if (!trackId) {
      //if the user hasnt used spotify in a while, recommend random songs for them to listen to
      const fetchAllGenres = await fetch(
        `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { genres: allGenres } = await fetchAllGenres.json();

      const arr = [
        Math.trunc(Math.random() * 4) + 1,
        Math.trunc(Math.random() * 3),
      ];
      const genreStart = Math.min(...arr);
      const genreEnd = Math.max(...arr);

      const recommendableGenres = allGenres.slice(genreStart, genreEnd);
      const allGenresString = recommendableGenres.join(",");

      result = await fetch(
        `https://api.spotify.com/v1/recommendations?seed_genres=${allGenresString}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      result = await fetch(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    if (!result.ok) {
      throw new Error(result.status);
    }

    const data = await result.json();
    return data;
  } catch (err) {
    throw err;
  }
}
