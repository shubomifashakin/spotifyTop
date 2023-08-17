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

    console.log(e.target.dataset.requestedData);
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

  parseToHtml(
    requestedData,
    topName,
    albumName,
    fromLabel,
    imgSrc,
    artistName,
    audSrc,
    reqLink
  ) {
    // console.log(reqLink);
    this.requestedDataLabel.textContent = requestedData;
    this.top1section.classList.add(`${requestedData}s-active`);
    this.top1Name.textContent = topName;
    this.top1NameLink.href = reqLink;
    this.top1AlbumName.textContent = albumName;
    this.top1FromLabel.textContent = fromLabel;
    this.top1image.src = imgSrc;

    //if there is an audio src, it means we are showing tracks. so display fromArtists and the see more tracks btn. also hide the see more artists. (& vice versa)

    if (requestedData === "track") {
      this.top1FromArtist.style.display = this.seeMoreTracks.style.display =
        "block";
      this.seeMoreArtists.style.display = "none";
    } else {
      this.seeMoreTracks.style.display = this.top1FromArtist.style.display =
        "none";
      this.seeMoreArtists.style.display = "block";
    }
    // audSrc
    //   ? ((this.top1FromArtist.style.display = this.seeMoreTracks.style.display =
    //       "block"),
    //     (this.seeMoreArtists.style.display = "none"))
    //   : ((this.seeMoreTracks.style.display = this.top1FromArtist.style.display =
    //       "none"),
    //     (this.seeMoreArtists.style.display = "block"));

    this.top1ArtistName.textContent = artistName;
    this.audioEl.src = audSrc;
    this.audioEl.pause();
  }

  //it animates the top1 section into view
  async animateTop1SectionToView() {
    //animate the top1 section into view
    const newTimeline = gsap.timeline({ defaults: { duration: 1 } });

    //if there is a timeline stored in the model, set a delay for the animation, so the previous animation can finish
    newTimeline
      .to(UserInterface.navbar, {
        display: "flex",
        opacity: 1,
        delay: user.timeline ? 14 : 1,
      })
      .to(UserInterface.topContainer, { display: "block" }, "<")
      .to(top1Section.top1section, { display: "flex", opacity: 1 }, "<")
      .to(
        UserInterface.footer,
        {
          display: "flex",
          opacity: 1,
        },
        "<"
      );

    //clear the timeline stored in the userview
    user.timeline = "";
  }
}

export const top1Section = new Top1();
