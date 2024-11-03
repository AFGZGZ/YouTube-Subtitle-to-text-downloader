import React, { useState, useEffect } from "react";
import { downloadSubs, getInitPlayerResp } from "./utils";
import "./App.css";

function App() {
  const [subtitles, setSubtitles] = useState(null);
  const [videoTitle, setVideoTitle] = useState(null);

  useEffect(() => {
    getInitPlayerResp().then(function (initPr) {
      setSubtitles(
        initPr.captions.playerCaptionsTracklistRenderer.captionTracks
      );
      setVideoTitle(initPr.videoDetails.title);
    });
  }, []);

  return (
    <div>
      {videoTitle ? <p>{videoTitle}</p> : <></>}
      <p>Click on a language to download a txt file with the transcript:</p>
      {subtitles ? (
        subtitles
          //Should we filter the automatic translated subtitles??
          // .filter((language) => language.kind !== "asr")
          .map((language) => (
            <button
              key={language.languageCode}
              style={{ marginTop: "3px" }}
              onClick={() =>
                downloadSubs(
                  videoTitle,
                  language.languageCode,
                  language.baseUrl
                )
              }
            >
              {language.name.simpleText}
            </button>
          ))
      ) : (
        <p>No subtitles available</p>
      )}
    </div>
  );
}

export default App;
