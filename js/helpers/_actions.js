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
    console.log(err);
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

    const [tracks, artists] = result;
    const tracksData = await tracks.json();
    const artistsData = await artists.json();
    // console.log(tracksData);
    return [tracksData, artistsData];
  } catch (err) {
    console.log(err);
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
    console.log(err);

    throw err;
  }
}

export async function similarSongs(token, trackId) {
  try {
    const result = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}`,
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
    console.log(err);

    throw err;
  }
}
