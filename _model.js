class UserData {
  #userProfile = "";
  #topTracks = "";
  #topArtists = "";

  #accessToken;
  timeline;

  get getUserProfile() {
    return this.#userProfile;
  }

  get getTopTracks() {
    return this.#topTracks;
  }

  get getTopArtists() {
    return this.#topArtists;
  }

  set updateUserProfile(data) {
    this.#userProfile = data;
  }

  set updateTopTracks(data) {
    this.#topTracks = data;
  }

  set updateTopArtists(data) {
    this.#topArtists = data;
  }

  set updateAccessToken(token) {
    this.#accessToken = token;
  }

  get getAccessToken() {
    return this.#accessToken;
  }
}

export const user = new UserData();
