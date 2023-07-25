import * as HELPERS from "../helpers/_helpers";
import * as AUTH from "../helpers/_auth";
import { gsap } from "gsap";
import { user } from "../../_model";
import { openingSection } from "./_openSection";

class UI {
  innerApp = document.querySelector("#app");
  spinner = document.querySelector(".spinner");
  logInSection = document.querySelector(".log-in-section");
  logInBtn = document.querySelector(".log-in-btn");
  introSection = document.querySelector(".intro");
  introSectionHead = document.querySelector(".intro-head");
  introSectionUsername = document.querySelector(".intro-username");
  introSectionLead = document.querySelector(".intro-lead");
  introSectionBtnsCont = document.querySelector(".intro-btns");
  introSectionTracksBtn = document.querySelector(".intro-btn-1");
  introSectionArtistsBtn = document.querySelector(".intro-btn-2");

  audioEl = document.querySelector(".audio-el");
  navbar = document.querySelector(".navbar");
  top1section = document.querySelector(".top-tracks");
  top1image = document.querySelector(".top-album-image");
  top1TrackName = document.querySelector(".info-track-name");
  top1AlbumName = document.querySelector(".info-album-name");
  top1ArtistName = document.querySelector(".info-artist-name");
  seeMoreBtn = document.querySelector(".see-more");
  footer = document.querySelector(".app-footer");

  constructor() {
    //when the user clicks the log in btn they go to the auth
    this.logInBtn.addEventListener("click", this.goToAuth);

    //when the user clicks the top tracks button
    this.introSectionTracksBtn.addEventListener(
      "click",
      this.seeTopTracks.bind(this)
    );
  }

  getMostDominantColor(imageUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = imageUrl;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;

        const colorFrequency = {};

        for (let i = 0; i < pixelData.length; i += 4) {
          const r = pixelData[i];
          const g = pixelData[i + 1];
          const b = pixelData[i + 2];

          const color = `${r},${g},${b}`;
          colorFrequency[color] = (colorFrequency[color] || 0) + 1;
        }

        let maxFrequency = 0;
        let dominantColor = "";

        for (const color in colorFrequency) {
          if (colorFrequency[color] > maxFrequency) {
            maxFrequency = colorFrequency[color];
            dominantColor = color;
          }
        }

        resolve(dominantColor);
      };

      image.onerror = () => {
        reject(new Error("Failed to load the image."));
      };
    });
  }

  //when the user clicks the log in btn it goes to the auth flow
  async goToAuth() {
    localStorage.setItem("logged", true);
    AUTH.redirectToAuthCodeFlow(HELPERS.clientId);
  }

  async seeTopTracks() {
    //reverse the past timeline
    user.timeline.timeScale(2);
    user.timeline.reverse();
    const timeline = gsap.timeline({ defaults: { duration: 1 } });

    //set the name of the open section username textcontent
    openingSection.username.textContent = user.getUserProfile.display_name;

    //set the name of the requested data to tracks
    openingSection.requestedData.textContent = "tracks";

    //animate the section intro
    timeline
      .to(openingSection.section, {
        display: "block",
        delay: 4,
      })
      .to(openingSection.username, {
        display: "block",
        opacity: 1,
      })
      .to(openingSection.username, {
        display: "none",
        opacity: 0,
      })
      .to(openingSection.lead, {
        display: "block",
        opacity: 1,
      })
      .to(openingSection.lead, {
        display: "none",
        opacity: 0,
      })
      .to(openingSection.other, {
        display: "block",
        opacity: 1,
      })
      .to(openingSection.other, {
        display: "none",
        opacity: 0,
      })
      .to(openingSection.section, {
        opacity: 0,
        display: "none",
      });

    //show the tracks section
    const artistName = user.getTopTracks.items[0].artists[0].name;
    const trackName = user.getTopTracks.items[0].name;
    const albumName = user.getTopTracks.items[0].album.name;
    const albumImageUrl = user.getTopTracks.items[0].album.images[0].url;
    const previewUrl = user.getTopTracks.items[0].preview_url;
    console.log(artistName, trackName, albumName, albumImageUrl, previewUrl);
    const newBgColor = await this.getMostDominantColor(albumImageUrl);
    const newColor = newBgColor.split(",");
    document.documentElement.style.setProperty(
      "--bg-color",
      `rgb(${newBgColor})`
    );

    this.top1AlbumName.textContent = albumName;
    this.top1ArtistName.textContent = artistName;
    this.top1TrackName.textContent = trackName;
    this.top1image.src = albumImageUrl;
    this.audioEl.src = previewUrl;
    this.audioEl.pause();

    const newTimeline = gsap.timeline({ defaults: { duration: 1 } });
    newTimeline
      .to(this.navbar, { display: "flex", opacity: 1, delay: 14 })
      .to(this.top1section, { display: "flex", opacity: 1 })
      .to(this.footer, {
        display: "flex",
        opacity: 1,
        onComplete: () => {
          this.audioEl.play();
        },
      });
  }
}

export const UserInterface = new UI();
