import { top1Section } from "./_top1Section";
import { top20Section } from "./_top20section";
import { user } from "../../_model";
import { openingSection } from "./_openSection";
import { UserInterface } from "./_interface";
import * as HELPERS from "../helpers/_helpers";
import { gsap } from "gsap";
import { similarArtists, similarSongs } from "../helpers/_actions";
import { errorSection } from "./_errorSection";
import { MobileView } from "./_mobile";

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
      this.seeTop.bind(this, "track")
    );

    //when the user clicks the top artists button on the intro section
    this.introSectionArtistsBtn.addEventListener(
      "click",
      this.seeTop.bind(this, "artist")
    );
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
    console.log(reqLink);
    top1Section.requestedDataLabel.textContent = requestedData;
    top1Section.top1section.classList.add(`${requestedData}s-active`);
    top1Section.top1Name.textContent = topName;
    top1Section.top1NameLink.href = reqLink;
    top1Section.top1AlbumName.textContent = albumName;
    top1Section.top1FromLabel.textContent = fromLabel;
    top1Section.top1image.src = imgSrc;
    //if there is an audio src, it means we are showing tracks. so display fromArtists and the see more tracks btn. also hide the see more artists. (& vice versa)
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

  //insertSimilarHtml
  insertSimilarToError(similarData) {
    //clear the similar  container of previous html
    UserInterface.errorRecommendations.innerHTML = "";
    let html = "";
    for (let x = 0; x < similarData.length; x++) {
      const loopHtml = `<a href=${
        similarData[x].external_urls.spotify
      } class="rec-image-link">
        <img src=${
          similarData[x].images
            ? similarData[x]?.images[0].url
            : similarData[x].album.images[0].url
        } class="recommendations-image" />
      </a>`;

      html += loopHtml;
    }

    //insert the similar data into the html
    UserInterface.errorRecommendations.insertAdjacentHTML("beforeend", html);
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

  async seeTop(request) {
    MobileView.mobileInnerSection.innerHTML = "";
    //get the requested data from the model
    const reqData = user[request + "s"].items;

    //if the user does not have any data
    if (reqData.length < 1) {
      const errHeader = `Opps! it looks like you haven't been very active.`;

      const recHeader = `Here are some ${request}s you might like!`;

      //hide the intro section
      gsap.to(this.introSection, { display: "none" });

      //get the similar tracks
      const { tracks: similarTracks } = await similarSongs(user.getAccessToken);

      const similarTracks6 = similarTracks.slice(0, 6);

      //insert the similar data into the error section for recommendations
      this.insertSimilarToError(similarTracks6);

      //show the error section
      errorSection.showErrorSection(errHeader, recHeader);
    } else {
      //if user is accessing the view from the opening section, there is a timeline to animate from

      // and if the user is accessing the view from the navbar click, remove the top-20 section if it is there
      user.timeline
        ? this.comingFromIntro(request)
        : top20Section.hideTop20Section();

      let imageUrl;
      if (request === "artist") {
        //get the top artist data
        const artistName = reqData[0].name;
        imageUrl = reqData[0].images[0].url;
        const artistGenres = reqData[0].genres.slice(0, 2);
        const reqLink = reqData[0].external_urls.spotify;

        //show the navbarleft for artists
        UserInterface.navbarLeftTracks.classList.remove("active-left");
        UserInterface.navbarLeftArtists.classList.add("active-left");

        //set the data in the html
        this.parseToHtml(
          "artist",
          artistName,
          artistGenres,
          "Genres",
          imageUrl,
          undefined,
          undefined,
          reqLink
        );
      } else {
        //get the requested data from model

        const artistName = reqData[0].artists[0].name;
        const trackName = reqData[0].name;
        const albumName = reqData[0].album.name;
        imageUrl = reqData[0].album.images[0].url;
        const previewUrl = reqData[0].preview_url;
        const reqLink = reqData[0].external_urls.spotify;

        //show the nav left for the tracks section active
        UserInterface.navbarLeftTracks.classList.add("active-left");
        UserInterface.navbarLeftArtists.classList.remove("active-left");

        //add the data to the html
        this.parseToHtml(
          "track",
          trackName,
          albumName,
          "From",
          imageUrl,
          artistName,
          previewUrl,
          reqLink
        );

        //if we are coming from the opening seciton, delay the playing of the audio by 14 seconds so that it starts when the animation has finished. if there isn't play after 2.5seconds
        setTimeout(
          function () {
            top1Section.audioEl.play();
          },
          user.timeline ? 14000 : 2500
        );
      }

      //animate the top 1 section to view
      this.animateTop1SectionToView(imageUrl);
    }
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
      );

    //clear the timeline stored in the userview
    user.timeline = "";
  }

  animateIntroSectionToView(timeline) {
    timeline
      .to(this.introSection, { display: "flex", delay: 1 })
      .to(this.introSectionHead, {
        opacity: 1,
        onUpdate: () => {
          //show the users username
          this.introSectionUsername.textContent =
            user.getUserProfile.display_name;
        },
      })
      .to(this.introSectionLead, { opacity: 1 })
      .to(this.introSectionBtnsCont, { opacity: 1 });
  }
}

export const introSection = new Intro();
