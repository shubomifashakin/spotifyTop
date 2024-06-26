import * as HELPERS from "./_helpers";

export async function redirectToAuthCodeFlow(clientId) {
  //this generates a verifier
  const verifier = generateCodeVerifier(128);
  //it generates a challenge
  const challenge = await generateCodeChallenge(verifier);

  //it sets the verifier in our localstorage
  localStorage.setItem("verifier", verifier);

  //we create our search parameters
  const params = new URLSearchParams();

  //add the client id to the search parameters
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "https://545listeningstats.netlify.app/");
  //these are the scopes we want to access
  params.append(
    "scope",
    "user-read-private user-top-read user-read-currently-playing"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  //this sets the document url to contain the parameters gotten from the requests and goes to that link
  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;

  //then after we verify the user, it redirects back to our url specified and contains the code we got
}

//this generates a code verifier of the length passed into it
function generateCodeVerifier(length) {
  ///empty string where the code verifier would be stored
  let text = "";
  //string of characters where the code verifier would be selected from
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  //loop through all possible characters 128 times, select a random character from the string and add it to the empty text variable
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  //return the now generated code verifier which would be 128 in length
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  //encodes the code verifier we generated
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  //it returns the challenge
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getAccessToken(clientId, code) {
  //gets the verifier from the local storage
  const verifier = localStorage.getItem("verifier");
  // console.log(code);

  //creates a url search params
  const params = new URLSearchParams();
  //appends the client id to the search parameter
  params.append("client_id", clientId);
  //this is the grant type we are requesting for
  params.append("grant_type", "authorization_code");
  //sets the request code to the code we generated
  params.append("code", code);
  //this is the site our request redirects to after weve been authorized
  params.append("redirect_uri", "https://545listeningstats.netlify.app/");
  //this is the verifier we generated
  params.append("code_verifier", verifier);

  try {
    //send the data to the api
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      signal: AbortSignal.timeout(HELPERS.timeOutVal),
    });

    if (!result.ok) {
      throw new Error(result.status);
    }

    //the access token is returned from the api
    const { access_token } = await result.json();
    return access_token;
  } catch (err) {
    if (HELPERS.isItATimeOutError(err)) {
      throw HELPERS.requestTimedOut;
    }

    throw err;
  }
}
