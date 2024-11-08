export function daysAgo(dateString) {
  const nowDate = Date.now();
  const pastDate = new Date(dateString);

  const diffTime = nowDate - pastDate;

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 1
    ? "1 day ago"
    : diffDays === 0
    ? "Today"
    : `${diffDays} days ago`;
}

const localChromeExtensionId = "iccnendanoohhggjcghonkandiogched";
export function setAccessTokenInLocalStorage(token) {
  const { localStorage } = window;
  try {
    return localStorage.setItem("token", token);
  } catch (e) {
    // memory full
    return undefined;
  }
}

export const sendMessageToExtension = (message, responseCallback) => {
  try {
    console.log("try");
    window.hasOwnProperty(chrome);
  } catch (exception) {
    console.log("catch", exception);
    // Browser is not chrome
    return;
  }
  if (!chrome || !chrome.runtime) {
    console.log("notchrome");

    // Extension is not installed
    return;
  }

  try {
    chrome.runtime.sendMessage(
      localChromeExtensionId,
      message,
      responseCallback
    );
    console.log(message);
  } catch (exception) {
    console.error(
      `Could not communicate with ${localChromeExtensionId}: ${exception.message}`
    );
  }

  // try {
  //     chrome.runtime.sendMessage(publishedChromeExtensionId, message, responseCallback);
  // } catch (exception) {
  //     console.error(`Could not communicate with ${publishedChromeExtensionId}: ${exception.message}`);
  // }
};
