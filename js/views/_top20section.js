import { user } from "../../_model";
import { gsap } from "gsap";

class top20 {
  top20Container = document.querySelector(".top-20");

  hideTop20Section() {
    //if there is no user timeline, remove the top-20 section if it is there
    !user.timeline
      ? gsap.to(this.top20Container, { opacity: 0, display: "none" })
      : null;
  }
}

export const top20Section = new top20();
