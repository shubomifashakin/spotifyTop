export function timer() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      return reject(new Error("Request took too long"));
    }, 10000);
  });
}

//this is my client id
export const clientId = "fc734c3a9a3141f7b48eb1678dd2c6c5";
//this gets all the parameters in our url
export const params = new URLSearchParams(window.location.search);
//this gets the value of the code parameter in our url
export const code = params.get("code");
export const logged = localStorage.getItem("logged");

//this is our default time frame for every search
export const timeFrame = "short_term";
export const dataLimit = 20;
export const dataOffset = 0;

export async function getMostDominantColor(imageUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = imageUrl;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelData = imageData.data;

      const colorFrequency = {};

      for (let i = 0; i < pixelData.length; i += 4) {
        const r = pixelData[i];
        const g = pixelData[i + 1];
        const b = pixelData[i + 2];

        const color = `${r},${g},${b}`;
        colorFrequency[color] = (colorFrequency[color] || 0) + 1;
      }

      let maxFrequency = 0;
      let dominantColor = "";

      for (const color in colorFrequency) {
        if (colorFrequency[color] > maxFrequency) {
          maxFrequency = colorFrequency[color];
          dominantColor = color;
        }
      }

      resolve(dominantColor);
    };

    image.onerror = () => {
      reject(new Error("Failed to load the image."));
    };
  });
}
