import { gsap } from "gsap";
import { user } from "../../_model";
import { introSection } from "./_introSection";

class errorSect {
  errorSection = document.querySelector(".error-section");
  errorMessageSect = document.querySelector(".error-message");
  errorRecommendationsContainer = document.querySelector(
    ".error-recommendations"
  );
  errorRecommendations = document.querySelector(".recommendations");
  errorRecHeader = document.querySelector(".recommendations-header");
  errorReturnLink = document.querySelector(".error-return");

  constructor() {
    this.errorReturnLink.addEventListener(
      "click",
      this.returnToIntroSection.bind(this)
    );
  }

  returnToIntroSection() {
    const timeline = gsap.timeline({ defaults: { duration: 1 } });

    timeline
      .to(this.errorSection, { opacity: 1, display: "none" })
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

    user.timeline = timeline;
  }

  showErrorSection(err, recHeader) {
    this.errorMessageSect.textContent = err;
    //for the case where the request actually happened but the user does not have data to supply
    recHeader
      ? ((this.errorRecHeader.textContent = recHeader),
        (this.errorRecommendationsContainer.style.display = "block"))
      : //for the case where there is actually an error
        (this.errorReturnLink.style.display =
          this.errorRecommendationsContainer.style.display =
            "none");

    gsap.fromTo(
      this.errorSection,
      { display: "none", opacity: 0 },
      { display: "block", opacity: 1, delay: 1 }
    );
  }
}

export const errorSection = new errorSect();
