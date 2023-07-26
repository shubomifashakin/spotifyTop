import { top1Section } from "./_top1Section";
import { top20Section } from "./_top20section";
import { user } from "../../_model";
import { openingSection } from "./_openSection";
import { UserInterface } from "./_interface";
import * as HELPERS from "../helpers/_helpers";
import { gsap } from "gsap";

class Intro {
  introSection = document.querySelector(".intro");
  introSectionHead = document.querySelector(".intro-head");
  introSectionUsername = document.querySelector(".intro-username");
  introSectionLead = document.querySelector(".intro-lead");
  introSectionBtnsCont = document.querySelector(".intro-btns");
  introSectionTracksBtn = document.querySelector(".intro-btn-1");
  introSectionArtistsBtn = document.querySelector(".intro-btn-2");

  constructor() {
    //when the user clicks the top tracks button
    this.introSectionTracksBtn.addEventListener(
      "click",
      this.seeTopTracks.bind(this)
    );

    //when the user clicks the top artists button on the intro section
    this.introSectionArtistsBtn.addEventListener(
      "click",
      this.seeTopArtists.bind(this)
    );
  }

  parseToHtml(
    requestedData,
    topName,
    albumName,
    fromLabel,
    imgSrc,
    artistName,
    audSrc
  ) {
    top1Section.requestedDataLabel.textContent = requestedData;
    top1Section.top1section.classList.add(`${requestedData}s-active`);
    top1Section.top1Name.textContent = topName;
    top1Section.top1AlbumName.textContent = albumName;
    top1Section.top1FromLabel.textContent = fromLabel;
    top1Section.top1image.src = imgSrc;
    audSrc
      ? ((top1Section.top1FromArtist.style.display =
          top1Section.seeMoreTracks.style.display =
            "block"),
        (top1Section.seeMoreArtists.style.display = "none"))
      : ((top1Section.seeMoreTracks.style.display =
          top1Section.top1FromArtist.style.display =
            "none"),
        (top1Section.seeMoreArtists.style.display = "block"));

    top1Section.top1ArtistName.textContent = artistName;
    top1Section.audioEl.src = audSrc;
    top1Section.audioEl.pause();
  }

  seeTopTracks() {
    //if user is accessing the view from the opening section, there is a timeline to animate from
    user.timeline ? this.comingFromIntro("track") : null;

    //if there is no user timeline, remove the top-20 section if it is there
    top20Section.hideTop20Section();

    //get the requested data from model
    const artistName = user.getTopTracks.items[0].artists[0].name;
    const trackName = user.getTopTracks.items[0].name;
    const albumName = user.getTopTracks.items[0].album.name;
    const albumImageUrl = user.getTopTracks.items[0].album.images[0].url;
    const previewUrl = user.getTopTracks.items[0].preview_url;

    //show the nav left for the tracks section active
    UserInterface.navbarLeftTracks.classList.add("active-left");
    UserInterface.navbarLeftArtists.classList.remove("active-left");

    //add the data to the html
    this.parseToHtml(
      "track",
      trackName,
      albumName,
      "From",
      albumImageUrl,
      artistName,
      previewUrl
    );

    //if there is a user timeline delay the playing of the audio by 14seconds to match with the display of the top 10
    setTimeout(
      function () {
        top1Section.audioEl.play();
      },
      user.timeline ? 14000 : 3000
    );

    //animate the top1 section into view
    this.animateTop1SectionToView(albumImageUrl);
  }

  //when the user clicks a button on the intro section
  comingFromIntro(request) {
    //reverse the past timeline
    user.timeline.timeScale(2);
    user.timeline.reverse();

    //set the name of the open section username & navbar textcontent
    UserInterface.navbarUsername.textContent =
      openingSection.username.textContent = user.getUserProfile.display_name;

    //set the name of the requested data in html
    openingSection.requestedData.textContent = request + "s";
    top1Section.requestedDataLabel.textContent = request;

    //animate the section intro
    openingSection.animateSectionIntro();
  }

  seeTopArtists() {
    //if user is accessing the view from the opening section, there is a timeline to animate from
    user.timeline ? this.comingFromIntro("artist") : null;

    //if there is no user timeline, remove the top-20 section if it is there
    top20Section.hideTop20Section();

    //get the top artist data
    const artistName = user.getTopArtists.items[0].name;
    const artistImageUrl = user.getTopArtists.items[0].images[0].url;
    const artistGenres = user.getTopArtists.items[0].genres.slice(0, 2);

    //show the navbarleft for artists
    UserInterface.navbarLeftTracks.classList.remove("active-left");
    UserInterface.navbarLeftArtists.classList.add("active-left");

    //set the data in the html
    this.parseToHtml(
      "artist",
      artistName,
      artistGenres,
      "Genres",
      artistImageUrl
    );

    //animate the top 1 section to view
    this.animateTop1SectionToView(artistImageUrl);
  }

  //it animates the top1 section into view
  async animateTop1SectionToView(imageUrl) {
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
      )
      .from(top1Section.top1image, {
        filter: "blur(20px)",
        onComplete: async () => {
          //get the most dominant color from the image
          const newAltColor = await HELPERS.getMostDominantColor(imageUrl);

          //turn it into an array
          const altBgColor = newAltColor.split(",");

          //display the alt bg and change the color to the set color
          gsap.to(UserInterface.altBg, {
            display: "block",
            background: `rgb(${Math.round(altBgColor[0] * 0.45)},${Math.round(
              altBgColor[0] * 0.45
            )},${Math.round(altBgColor[0] * 0.4)})`,
            opacity: 1,
          });
        },
      });

    //clear the timeline stored in the userview
    user.timeline = "";
  }
}

export const introSection = new Intro();
