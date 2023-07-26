import { UserInterface } from "./js/views/_interface";
import * as HELPERS from "./js/helpers/_helpers";
import * as ACTIONS from "./js/helpers/_actions";
import { getAccessToken } from "./js/helpers/_auth";
import { user } from "./_model";
import { animate, timeline } from "motion";
import { gsap } from "gsap";
import { introSection } from "./js/views/_introSection";

//if there is no code in the url, redirect to authorization
if (HELPERS.code && HELPERS.logged) {
  //removes the logged value from the local storage
  localStorage.removeItem("logged");

  //hide the button
  animate(UserInterface.logInSection, { opacity: 0, display: "none" });
  animate(UserInterface.spinner, { display: "block" });

  const accessToken = await getAccessToken(HELPERS.clientId, HELPERS.code);
  const profile = await ACTIONS.fetchProfile(accessToken);
  const [topTracks, topArtists] = await ACTIONS.fetchTop(
    accessToken,
    HELPERS.timeFrame,
    HELPERS.dataLimit
  );

  animate(UserInterface.spinner, { display: "none" });
  //set the users data in the model
  user.updateTopArtists = topArtists;
  user.updateTopTracks = topTracks;
  user.updateUserProfile = profile;

  //show the intro or greeting section
  console.log(user.getTopTracks);
  console.log(user.getTopArtists);
  console.log(user.getUserProfile);
  const timeline = gsap.timeline({ defaults: { duration: 1 } });

  //animate the intro section to view
  timeline
    .to(introSection.introSection, { display: "flex", delay: 1 })
    .to(introSection.introSectionHead, {
      opacity: 1,
      onUpdate: () => {
        //show the users username
        introSection.introSectionUsername.textContent =
          user.getUserProfile.display_name;
      },
    })
    .to(introSection.introSectionLead, { opacity: 1 })
    .to(introSection.introSectionBtnsCont, { opacity: 1 });

  //set the timeline in the model so it can be accessible anywhere
  user.timeline = timeline;
}
