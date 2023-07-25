import { UserInterface } from "./js/views/_interface";
import * as HELPERS from "./js/helpers/_helpers";
import * as ACTIONS from "./js/helpers/_actions";
import { getAccessToken } from "./js/helpers/_auth";
import { user } from "./_model";
import { animate, timeline } from "motion";
import { gsap } from "gsap";

//if there is no code in the url, redirect to authorization
if (!HELPERS.code) {
} else if (HELPERS.code && HELPERS.logged) {
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
  console.log(user.getUserProfile);
  const timeline = gsap.timeline({ defaults: { duration: 1 } });

  //animate the intro section to view
  timeline
    .to(UserInterface.introSection, { display: "flex", delay: 1 })
    .to(UserInterface.introSectionHead, {
      opacity: 1,
      onUpdate: () => {
        //show the users username
        UserInterface.introSectionUsername.textContent =
          user.getUserProfile.display_name;
      },
    })
    .to(UserInterface.introSectionLead, { opacity: 1 })
    .to(UserInterface.introSectionBtnsCont, { opacity: 1 });

  //set the timeline in the model so it can be accessible anywhere
  user.timeline = timeline;
}
