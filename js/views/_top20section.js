import { user } from "../../_model";
import { gsap } from "gsap";
import { similarArtists, similarSongs } from "../helpers/_actions";

class top20 {
  top20Container = document.querySelector(".top-20");
  top20Focus = document.querySelector(".top-20-focus");
  top20FocusImageEl = document.querySelector(".focus-image");
  top20Main = document.querySelector(".top-20-main");

  focusLabels = document.querySelectorAll(".focus-label");
  focusLabel1 = document.querySelector(".focus-label-1");
  focusLabel2 = document.querySelector(".focus-label-2");
  focusLabel3 = document.querySelector(".focus-label-3");

  focusData1 = document.querySelector(".focus-data-1");
  focusData2 = document.querySelector(".focus-data-2");
  focusData3 = document.querySelector(".focus-data-3");

  focusSimilarSect = document.querySelector(".focus-similar");
  focusSimilarLabelInner = document.querySelector(".focus-label-inner");

  focusSimilarInnerOverflowCont = document.querySelector(
    ".focus-similar-overflow"
  );

  timeLine = "";

  constructor() {
    document.addEventListener("click", this.focusTopItem.bind(this));

    document.addEventListener("keydown", this.focusTopItem.bind(this));
  }

  async focusTopItem(e) {
    //gets display value of the top section property
    const inDisplay = getComputedStyle(this.top20Container).display;

    //if the target clicked is not a child of top-item do nothing or the user clicked outside the top20 section

    if (
      inDisplay !== "none" &&
      ((!e?.target.closest(".top-item") && !e.key) || e?.key === "Escape")
    ) {
      //if there is a timeline when a non child is clicked, reverse the timeline, if there isnt do nothing
      this.timeLine ? this.timeLine.reverse() : null;

      //clear the similar  container of previous html
      this.focusSimilarInnerOverflowCont.innerHTML = "";

      //remove the focused class from focused items
      this.removeFocusClassFromAllItems();
    } else if (inDisplay !== "none" && e.target.closest(".top-item")) {
      //the item clicked
      const elClicked = e.target.closest(".top-item");
      const typeOfRequest = elClicked.dataset.label;

      //remove the focused class from every item
      this.removeFocusClassFromAllItems();

      //add the focused class to only the item clicked
      elClicked.classList.add("focused-item");

      //show the focus section
      const timeLine = gsap.timeline({ defaults: { duration: 1 } });
      timeLine.fromTo(
        this.top20Focus,
        { opacity: 0, display: "none", width: 0 },
        { display: "flex", opacity: 1, width: "30%" }
      );

      //set the timeline in the class so it is accessible everywhere
      this.timeLine = timeLine;

      //get the image src from the clicked element and set the src of the focus image to it
      const imgSrc = elClicked.querySelector(".top-image").src;
      this.top20FocusImageEl.src = imgSrc;

      this.focusLabel1.textContent =
        elClicked.querySelector(".top-label-1").textContent;

      this.focusData1.textContent =
        elClicked.querySelector(".top-data-1").textContent;

      this.focusLabel2.textContent =
        elClicked.querySelector(".top-label-2").textContent;

      this.focusData2.textContent =
        elClicked.querySelector(".top-data-2").textContent;

      this.focusSimilarLabelInner.textContent = `${elClicked
        .querySelector(".top-label-1")
        .textContent.trim()}s`;

      //get the similar artists from spotify
      const requestId = elClicked.dataset.requestId;

      const similarData = await this.handleSimilarData(
        requestId,
        typeOfRequest
      );
      this.insertSimilarHtml(similarData);
    }
  }

  async handleSimilarData(requestId, typeOfRequest) {
    if (typeOfRequest === "Artist") {
      const { artists: similar } = await similarArtists(
        user.getAccessToken,
        requestId
      );
      return this.randomlySelectSimilarData(similar);
    } else {
      const { tracks: similarTracks } = await similarSongs(
        user.getAccessToken,
        requestId
      );

      return this.randomlySelectSimilarData(similarTracks);
    }
  }

  randomlySelectSimilarData(similar) {
    //get random similar atists from the data returned
    const arr = [
      Math.trunc(Math.random() * 20),
      Math.trunc(Math.random() * 20),
    ];
    const simStart = Math.min(...arr);
    const simStop = Math.max(...arr);
    const randomSimilar = similar.slice(simStart, simStop + 1);

    return randomSimilar;
  }

  removeFocusClassFromAllItems() {
    //select all the top items
    const allTopItems = document.querySelectorAll(".top-item");

    //remove the focus element from all top items inner
    allTopItems.forEach((item) => {
      item.classList.remove("focused-item");
    });
  }

  hideTop20Section() {
    //if there is no user timeline, remove the top-20 section if it is there
    !user.timeline
      ? gsap.to(this.top20Container, { opacity: 0, display: "none" })
      : null;
  }

  //insertSimilarHtml
  insertSimilarHtml(similarData) {
    //clear the similar  container of previous html
    this.focusSimilarInnerOverflowCont.innerHTML = "";
    let html = "";
    for (let x = 0; x < similarData.length; x++) {
      const loopHtml = `<a href=${
        similarData[x].external_urls.spotify
      } class="similar-data">
        <img src=${
          similarData[x].images
            ? similarData[x]?.images[0].url
            : similarData[x].album.images[0].url
        } class="similar-image" />
      </a>`;

      html += loopHtml;
    }

    this.focusSimilarInnerOverflowCont.insertAdjacentHTML("beforeend", html);
  }

  //inserts the top 20 data into the top 20 section html
  insertTop20Data(dataRequested) {
    if (dataRequested === "all-tracks") {
      let dataReq = user.tracks.items;

      this.parseTop20DataToHtml(dataReq, "Track");
    } else {
      let dataReq = user.artists.items;

      this.parseTop20DataToHtml(dataReq, "Artist");
    }
  }

  parseTop20DataToHtml(dataReq, label) {
    //clear the top20 section first
    this.top20Main.innerHTML = "";

    let colNumber = 1;
    let html = "";
    for (let x = 0; x < dataReq.length; x += 4) {
      const loopHtml = `
      <div class="col col-${colNumber}">
      <span class="top-item" data-label=${label} data-request-id=${
        dataReq[x].id
      }>

        <div class="top-item-inner">
          <div class="top-image-container">
            <img src=${
              label === "Track"
                ? dataReq[x].album.images[0].url
                : dataReq[x].images[0].url
            } class="top-image" />
          </div>

            <div class="top-item-details">
                <span class="detail">
                <div class="top-label-no">
                <p class="top-label top-label-1">
                ${label}
                </p>

                <p class="top-item-no">${x + 1}</p>
            </div>
              <p class="top-data top-data-1">${dataReq[x].name}</p></span
            >

            <span class="detail">
              <p class="top-label top-label-2">${
                label === "Track" ? "By" : "Genres"
              }</p>
              <p class="top-data top-data-2">${
                label === "Track"
                  ? dataReq[x].artists[0].name
                  : dataReq[x].genres.slice(0, 2)
              }</p></span
            >
          </div>
        </div>
      </span>

      <span class="top-item" data-label=${label} data-request-id=${
        dataReq[x + 1].id
      }>

        <div class="top-item-inner">
          <div class="top-image-container">
            <img src=${
              label === "Track"
                ? dataReq[x + 1].album.images[0].url
                : dataReq[x + 1].images[0].url
            }  class="top-image" />
          </div>

          <div class="top-item-details">
            <span class="detail">
             <div class="top-label-no">
                    <p class="top-label top-label-1">
                    ${label}
                    </p>

                    <p class="top-item-no">${x + 2}</p>
                </div>
              <p class="top-data top-data-1">${dataReq[x + 1].name}</p></span
            >

            <span class="detail">
              <p class="top-label top-label-2">${
                label === "Track" ? "By" : "Genres"
              }</p>
              <p class="top-data top-data-2">${
                label === "Track"
                  ? dataReq[x + 1].artists[0].name
                  : dataReq[x + 1].genres.slice(0, 2)
              }</p></span
            >
          </div>
        </div>
      </span>

      <span class="top-item" data-label=${label} data-request-id=${
        dataReq[x + 2].id
      }>

        <div class="top-item-inner">
          <div class="top-image-container">
            <img src=${
              label === "Track"
                ? dataReq[x + 2].album.images[0].url
                : dataReq[x + 2].images[0].url
            }   class="top-image" />
          </div>

          <div class="top-item-details">
            <span class="detail">
            <div class="top-label-no">
            <p class="top-label top-label-1">
            ${label}
            </p>

            <p class="top-item-no">${x + 3}</p>
        </div>
              <p class="top-data top-data-1">${dataReq[x + 2].name}</p></span
            >

            <span class="detail">
              <p class="top-label top-label-2">${
                label === "Track" ? "By" : "Genres"
              }</p>
              <p class="top-data top-data-2">${
                label === "Track"
                  ? dataReq[x + 2].artists[0].name
                  : dataReq[x + 2].genres.slice(0, 2)
              }</p></span
            >
          </div>
        </div>
      </span>

      <span class="top-item" data-label=${label} data-request-id=${
        dataReq[x + 3].id
      }>

        <div class="top-item-inner">
          <div class="top-image-container">
            <img src=${
              label === "Track"
                ? dataReq[x + 3].album.images[0].url
                : dataReq[x + 3].images[0].url
            }  class="top-image" />
          </div>

          <div class="top-item-details">
            <span class="detail">
                <div class="top-label-no">
                    <p class="top-label top-label-1">
                    ${label}
                    </p>

                    <p class="top-item-no">${x + 4}</p>
                </div>
                <p class="top-data top-data-1">${dataReq[x + 3].name}</p>
              </span>

            <span class="detail">
              <p class="top-label top-label-2">${
                label === "Track" ? "By" : "Genres"
              }</p>
              <p class="top-data top-data-2">${
                label === "Track"
                  ? dataReq[x + 3].artists[0].name
                  : dataReq[x + 3].genres.slice(0, 2)
              }</p></span
            >
          </div>
        </div>
      </span>
    </div>
      
      `;

      html += loopHtml;

      colNumber++;
    }

    this.top20Main.innerHTML = "";
    this.top20Main.insertAdjacentHTML("beforeend", html);
  }
}

export const top20Section = new top20();
