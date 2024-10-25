import { UserInterface } from "./js/views/_interface";
import * as HELPERS from "./js/helpers/_helpers";
import * as ACTIONS from "./js/helpers/_actions";
import { getAccessToken } from "./js/helpers/_auth";
import { user } from "./_model";
import { animate } from "motion";
import { gsap } from "gsap";
import { introSection } from "./js/views/_introSection";
import { errorSection } from "./js/views/_errorSection";

import "regenerator-runtime/runtime.js";

async function LoadSite() {
  //if there is no code in the url, redirect to authorization
  if (HELPERS.code && HELPERS.logged) {
    //removes the logged value from the local storage
    localStorage.removeItem("logged");

    //hide the button
    animate(UserInterface.logInSection, { opacity: 0, display: "none" });

    //add the loading spinner
    animate(UserInterface.spinner, { display: "block" });
    try {
      const accessToken = await getAccessToken(HELPERS.clientId, HELPERS.code);
      //set the access token in the model
      user.updateAccessToken = accessToken;
      const profile = await ACTIONS.fetchProfile(accessToken);
      const [topTracks, topArtists] = await ACTIONS.fetchTop(
        accessToken,
        HELPERS.timeFrame,
        HELPERS.dataLimit
      );

      //remove the spinner
      animate(UserInterface.spinner, { display: "none" });
      //set the users data in the model
      user.updateTopArtists = topArtists;
      user.updateTopTracks = topTracks;
      user.updateUserProfile = profile;

      //show the intro or greeting section

      const timeline = gsap.timeline({ defaults: { duration: 1 } });

      //animate the intro section to view
      introSection.animateIntroSectionToView(timeline);
      //set the timeline in the model so it can be accessible anywhere
      user.timeline = timeline;
    } catch (err) {
      //remove spinner & display the error section
      animate(UserInterface.spinner, { display: "none" });
      errorSection.showErrorSection(err);
    }
  }
}

LoadSite();
