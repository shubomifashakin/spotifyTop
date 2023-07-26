import { gsap } from "gsap";

class OpenSection {
  //open section
  section = document.querySelector(".open-section");
  username = document.querySelector(".open-username");
  lead = document.querySelector(".open-lead");
  other = document.querySelector(".open-lead-2");
  requestedData = document.querySelector(".nameOfRequest");

  animateSectionIntro() {
    //animate the section intro
    const timeline = gsap.timeline({ defaults: { duration: 1 } });

    timeline
      .to(openingSection.section, {
        display: "block",
        delay: 4,
      })
      .to(openingSection.username, {
        display: "block",
        opacity: 1,
      })
      .to(openingSection.username, {
        display: "none",
        opacity: 0,
      })
      .to(openingSection.lead, {
        display: "block",
        opacity: 1,
      })
      .to(openingSection.lead, {
        display: "none",
        opacity: 0,
      })
      .to(openingSection.other, {
        display: "block",
        opacity: 1,
      })
      .to(openingSection.other, {
        display: "none",
        opacity: 0,
      })
      .to(openingSection.section, {
        opacity: 0,
        display: "none",
      });
  }
}

export const openingSection = new OpenSection();
