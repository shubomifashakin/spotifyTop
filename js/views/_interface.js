import * as HELPERS from "../helpers/_helpers";
import * as AUTH from "../helpers/_auth";
import { introSection } from "./_introSection";

class UI {
  innerApp = document.querySelector("#app");
  spinner = document.querySelector(".spinner");
  logInSection = document.querySelector(".log-in-section");
  logInBtn = document.querySelector(".log-in-btn");

  altBg = document.querySelector(".alt-bg");
  navbar = document.querySelector(".navbar");
  navbarLeftTracks = document.querySelector(".nav-left-track");
  navbarLeftArtists = document.querySelector(".nav-left-artist");
  navbarUsername = document.querySelector(".nav-username");
  topContainer = document.querySelector(".top-container");
  footer = document.querySelector(".app-footer");

  constructor() {
    //when the user clicks the log in btn they go to the auth
    this.logInBtn.addEventListener("click", this.goToAuth);

    this.navbar.addEventListener("click", this.navbarEventCb.bind(this));
  }

  navbarEventCb(e) {
    if (e.target.classList.contains("nav-left-link")) {
      console.log(e.target.dataset.targetSection);
      e.target.dataset.targetSection === "topTracks"
        ? introSection.seeTopTracks()
        : introSection.seeTopArtists();
    } else if (e.target.classList.contains("nav-log-out")) {
      location.reload();
    }
  }

  //when the user clicks the log in btn it goes to the auth flow
  async goToAuth() {
    localStorage.setItem("logged", true);
    AUTH.redirectToAuthCodeFlow(HELPERS.clientId);
  }
}

export const UserInterface = new UI();
