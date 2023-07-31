import { gsap } from "gsap";
import { user } from "../../_model";
import { introSection } from "./_introSection";
import { top1Section } from "./_top1Section";
import { top20Section } from "./_top20section";
import { UserInterface } from "./_interface";

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

    timeline.to(this.errorSection, { opacity: 1, display: "none" });

    introSection.animateIntroSectionToView(timeline);

    user.timeline = "";
  }

  showErrorSection(err, recHeader) {
    //hide the user interface elements(the navbar, footer and top section)
    UserInterface.hideInterfaceElements();
    //set the error message
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
