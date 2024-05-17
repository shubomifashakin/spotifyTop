//this is my client id
export const clientId = import.meta.env.VITE_CLIENT_ID;

//this gets all the parameters in our url
export const params = new URLSearchParams(window.location.search);

//this gets the value of the code parameter in our url
export const code = params.get("code");

export const logged = localStorage.getItem("logged");

//this is our default time frame for every search
export const timeFrame = "short_term";
export const dataLimit = 20;
export const dataOffset = 0;

//default fetch timeOutVal
export const timeOutVal = 10000;

//checks if the error is a timeout error
export function isItATimeOutError(err) {
  return /\btimeouterror\b/i.test(err);
}

export const requestTimedOut = "Request Timed Out! Try Again";
