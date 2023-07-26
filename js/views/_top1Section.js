import { gsap } from "gsap";
import { top20Section } from "./_top20section";
import { UserInterface } from "./_interface";

class Top1 {
  audioEl = document.querySelector(".audio-el");
  requestedDataLabel = document.querySelector(".requestedData");
  top1section = document.querySelector(".top-1-section");
  top1image = document.querySelector(".top-album-image");
  top1Main = document.querySelector(".top-1-main");
  top1Name = document.querySelector(".info-top-name");
  top1From = document.querySelector(".from-album");
  top1FromLabel = document.querySelector(".from-album-label");
  top1AlbumName = document.querySelector(".info-album-name");
  top1FromArtist = document.querySelector(".from-artist");
  top1ArtistName = document.querySelector(".info-artist-name");
  seeMoreTracks = document.querySelector(".see-more-tracks");
  seeMoreArtists = document.querySelector(".see-more-artists");

  constructor() {
    this.seeMoreTracks.addEventListener(
      "click",
      this.showTop20Tracks.bind(this)
    );
  }

  showTop20Tracks(e) {
    //pause the music playing
    this.audioEl.pause();

    //go back to the previous background
    //display the alt bg and change the color to the set color
    gsap.to(UserInterface.altBg, {
      opacity: 0,
      display: "none",
    });

    //animate the top 1 section out and animate the top 20 section in
    const timeline = gsap.timeline({
      defaults: { duration: 1, ease: "linear" },
    });

    timeline
      .to(this.top1section, { display: "none", opacity: 0 })
      .to(top20Section.top20Container, { display: "flex", opacity: 1 });
  }
}

export const top1Section = new Top1();
