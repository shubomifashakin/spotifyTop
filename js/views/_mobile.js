import { user } from "../../_model";

class MobileV {
  mobileSection = document.querySelector(".top-20-mobile");
  mobileInnerSection = document.querySelector(".top-20-mobile-inner");

  //inserts the top 20 data into the top 20 section html
  insertMobileTop20Data(dataRequested) {
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
    this.mobileInnerSection.innerHTML = "";

    let colNumber = 1;
    let html = "";
    for (let x = 0; x < dataReq.length; x += 3) {
      const loopHtml = `  <div class="mobile-col mobile-col-${colNumber}">
      <span class="mobile-top-item " data-request-id=${dataReq[x].id}>
        <div class="mobile-top-image-container">
          <img src=${
            label === "Track"
              ? dataReq[x].album.images[0].url
              : dataReq[x].images[0].url
          } class="mobile-image" />
    
      
        </div>
    
        <div class="mobile-top-details">
          <span class="detail detail-1">
            <p class="mobile-top-label">${label}    <span class="mobile-top-no">${
        x + 1
      }</span></p>
            <p class="mobile-top-data">
           <a href=${
             dataReq[x].external_urls.spotify
           } class="mobile-top-data-link"> ${
        dataReq[x].name
      }<i class="fa-brands fa-spotify spotify-icon"></i></a>
            </p>
          </span>
    
          <span class="detail detail-2">
            <p class="mobile-top-label mobile-top-label-2">${
              label === "Track" ? "By" : "Genres"
            }</p>
            <p class="mobile-top-data mobile-top-data-2">${
              label === "Track"
                ? dataReq[x].artists[0].name
                : dataReq[x].genres.slice(0, 2)
            }</p>
          </span>
        </div>
      </span>
    
      <span class="mobile-top-item" data-request-id=${dataReq[x + 1].id}>
        <div class="mobile-top-image-container">
          <img src=${
            label === "Track"
              ? dataReq[x + 1].album.images[0].url
              : dataReq[x + 1].images[0].url
          }  class="mobile-image" />
    
   
        </div>
    
        <div class="mobile-top-details">
          <span class="detail detail-1">
            <p class="mobile-top-label"> ${label} <span class="mobile-top-no">${
        x + 2
      }</span></p>
            <p class="mobile-top-data">
            <a href=${
              dataReq[x + 1].external_urls.spotify
            } class="mobile-top-data-link"> ${
        dataReq[x + 1].name
      }<i class="fa-brands fa-spotify spotify-icon"></i></a>
            </p>
          </span>
    
          <span class="detail detail-2">
            <p class="mobile-top-label mobile-top-label-2">${
              label === "Track" ? "By" : "Genres"
            }</p>
            <p class="mobile-top-data mobile-top-data-2">${
              label === "Track"
                ? dataReq[x + 1].artists[0].name
                : dataReq[x + 1].genres.slice(0, 2)
            }</p>
          </span>
        </div>
      </span>
    
      ${
        x === 18
          ? null
          : `<span class="mobile-top-item " data-request-id=${
              dataReq[x + 2].id
            }>
      <div class="mobile-top-image-container">
        <img src=${
          label === "Track"
            ? dataReq[x + 2].album.images[0].url
            : dataReq[x + 2].images[0].url
        } class="mobile-image" />
  
      </div>
  
      <div class="mobile-top-details">
        <span class="detail detail-1">
          <p class="mobile-top-label">${label}       <span class="mobile-top-no">${
              x + 3
            }</span></p>
          <p class="mobile-top-data">
          <a href=${
            dataReq[x + 2].external_urls.spotify
          } class="mobile-top-data-link"> ${
              dataReq[x + 2].name
            }<i class="fa-brands fa-spotify spotify-icon"></i></a>
          </p>
        </span>
  
        <span class="detail detail-2">
          <p class="mobile-top-label mobile-top-label-2">${
            label === "Track" ? "By" : "Genres"
          }</p>
          <p class="mobile-top-data mobile-top-data-2">${
            label === "Track"
              ? dataReq[x + 2].artists[0].name
              : dataReq[x + 2].genres.slice(0, 2)
          }</p>
        </span>
      </div>
    </span>`
      }
    </div>`;

      html += loopHtml;

      colNumber++;
    }

    this.mobileInnerSection.innerHTML = "";
    this.mobileInnerSection.insertAdjacentHTML("beforeend", html);
  }
}

export const MobileView = new MobileV();
