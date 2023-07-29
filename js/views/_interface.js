import * as HELPERS from "../helpers/_helpers";
import { gsap } from "gsap";
import * as AUTH from "../helpers/_auth";
import { introSection } from "./_introSection";
import { user } from "../../_model";

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

  errorSection = document.querySelector(".error-section");
  errorMessageSect = document.querySelector(".error-message");
  errorRecommendations = document.querySelector(".recommendations");
  errorRecHeader = document.querySelector(".recommendations-header");
  errorReturnLink = document.querySelector(".error-return");
  footer = document.querySelector(".app-footer");
  footerCurrentlyPlaying = document.querySelector(".currently");

  constructor() {
    //when the user clicks the log in btn they go to the auth
    this.logInBtn.addEventListener("click", this.goToAuth);

    this.navbar.addEventListener("click", this.navbarEventCb.bind(this));
  }

  navbarEventCb(e) {
    //if the user clicked the top top tracks or top artists link on the navbar.
    if (e.target.classList.contains("nav-left-link")) {
      console.log(e.target.dataset.targetSection);
      e.target.dataset.targetSection === "topTracks"
        ? introSection.seeTop("track")
        : introSection.seeTop("artist");
    }
    //if the user clicked the log out button on the navbar
    else if (e.target.classList.contains("nav-log-out")) {
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
