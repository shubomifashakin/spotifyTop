import { gsap } from "gsap";
import { top20Section } from "./_top20section";
import { UserInterface } from "./_interface";
import { user } from "../../_model";
import { MobileView } from "./_mobile";

class Top1 {
  audioEl = document.querySelector(".audio-el");
  requestedDataLabel = document.querySelector(".requestedData");
  top1section = document.querySelector(".top-1-section");
  top1image = document.querySelector(".top-album-image");
  top1Main = document.querySelector(".top-1-main");
  top1Name = document.querySelector(".info-top-name-inner");
  top1NameLink = document.querySelector(".info-top-link");
  top1From = document.querySelector(".from-album");
  top1FromLabel = document.querySelector(".from-album-label");
  top1AlbumName = document.querySelector(".info-album-name");
  top1FromArtist = document.querySelector(".from-artist");
  top1ArtistName = document.querySelector(".info-artist-name");
  seeMoreTracks = document.querySelector(".see-more-tracks");
  seeMoreArtists = document.querySelector(".see-more-artists");
  seeMore = document.querySelectorAll(".see-more");

  constructor() {
    this.seeMore.forEach((btn) => {
      btn.addEventListener("click", this.showTop20.bind(this));
    });
  }

  showTop20(e) {
    //pause the music playing

    this.audioEl.pause();

    //insert the data intro the top 20 section
    top20Section.insertTop20Data(e.target.dataset.requestedData);
    // gsap.to(MobileView.mobileSection, { display: "none" });

    //insert the data into the mobile view
    setTimeout(function () {
      MobileView.insertMobileTop20Data(e.target.dataset.requestedData);
    }, 1500);

    //change the color to the set color
    //animate the top 1 section out and animate the top 20 section in
    this.hideTop1Section();
    top20Section.showTop20Section();
  }

  hideTop1Section() {
    gsap.to(this.top1section, { display: "none", opacity: 0 });
  }
}

export const top1Section = new Top1();
