class UserData {
  #userProfile = "";
  #topTracks = "";
  #topArtists = "";

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
}

export const user = new UserData();
