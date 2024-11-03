//Gets the url from the active tab
function getActiveTabUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        resolve(tabs[0].url);
      } else {
        resolve(null);
      }
    });
  });
}

//Gets the ytInitialPlayerResponse from the Youtube video
export async function getInitPlayerResp() {
  const thisurl = await getActiveTabUrl();
  const response = await fetch(thisurl);
  const html = await response.text();
  const ytInitialPlayerResponse = JSON.parse(
    html
      .split("ytInitialPlayerResponse = ")[1]
      .split(`;var meta = document.createElement('meta')`)[0]
  );
  return ytInitialPlayerResponse;
}

//Gets the subs for the selected video and language
async function getSubs(url) {
  const compUrl = url + "&fmt=json3";
  return (await (await fetch(compUrl)).json()).events.map((x) => ({
    ...x,
    text:
      x.segs
        ?.map((x) => x.utf8)
        ?.join(" ")
        ?.replace(/\n/g, " ")
        ?.replace(/♪|'|"|\.{2,}|\<[\s\S]*?\>|\{[\s\S]*?\}|\[[\s\S]*?\]/g, "")
        ?.trim() || "",
  }));
}

// Downloads the selected sub
export async function downloadSubs(title, langCode, url) {
  const subs = await getSubs(url);
  const text = subs.map((x) => x.text).join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `${title}_${langCode}_subs.txt`;
  a.click();
  URL.revokeObjectURL(downloadUrl);
}
