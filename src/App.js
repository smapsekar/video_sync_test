import React, { useState, useMemo } from "react";
import "./styles.css";
export default function App() {
  let result;

  const [data, setData] = useState({ data: [] });

  const [inputJson, setInputJson] = useState(
    "https://accind0ds1.blob.core.windows.net/public/event.json"
  );

  const handleChange = (event) => {
    setInputJson(event.target.value);
    //console.log("value is:", event.target.value);
  };
  const fetchData = async () => {
    try {
      const response = await fetch(inputJson, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      result = await response.json();
      setData(result.videos);
      //console.log("result is: ", JSON.stringify(data, null, 4));
    } catch (err) {
    } finally {
    }
  };
  const handleClick = async (event) => {
    event.preventDefault();
    fetchData(inputJson);
  };
  //console.log(data);
  const refsById = useMemo(() => {
    const refs = {};
    data.length > 0 &&
      data.forEach((item) => {
        refs[item.source] = React.createRef(null);
      });
    return refs;
  }, [data]);

  const handleStart = (event) => {
    let seekTime = Math.abs(
      data[1].recordingStartTimestamp - data[0].recordingStartTimestamp
    );

    if (
      refsById["vid_2"].current.currentTime === 0 &&
      refsById["vid_1"].current.currentTime === 0
    ) {
      refsById["vid_1"].current.currentTime = seekTime / 1000;
    }
    refsById["vid_1"].current.play();
    refsById["vid_2"].current.play();
  };
  const handlePause = (event) => {
    refsById["vid_1"].current.pause();
    refsById["vid_2"].current.pause();
    //setPlayerTimeOnPause();
    //console.log("video 2 time", refsById["vid_2"].current.currentTime);
    //console.log("video 1 time", refsById["vid_1"].current.currentTime);
  };
  const handleOnEnded = (event) => {
    if (event.target.id === "vid_1") {
      refsById["vid_1"].current.currentTime = 0;
    }
    if (event.target.id === "vid_2") {
      refsById["vid_2"].current.currentTime = 0;
    }
  };

  const setPlayerTimeOnPause = () => {
    if (refsById["vid_2"].current?.currentTime) {
      var percentage2 = Math.round(
        (refsById["vid_2"].current?.currentTime /
          refsById["vid_2"].current.duration) *
          100
      );
      refsById["vid_2"].current.currentTime =
        Math.round(percentage2 * refsById["vid_2"].current?.duration) / 100;
    }
    if (refsById["vid_1"].current?.currentTime) {
      var percentage1 = Math.round(
        (refsById["vid_1"].current?.currentTime /
          refsById["vid_1"].current.duration) *
          100
      );
      refsById["vid_1"].current.currentTime =
        Math.round(percentage1 * refsById["vid_1"].current?.duration) / 100;
    }

    //console.log("currentTimeSet to of vid1", refsById["vid_1"].current.currentTime);
    //console.log("currentTimeSet to of vid2", refsById["vid_2"].current.currentTime);
  };
  const onPlaying = (e) => {
    //console.log("onPlaying", e);
  };

  const onCanPlayThrough = (e) => {
    //console.log("onCanPlayThrough",e.target ,e);
  };
  const onStalled = (event) => {
    console.log("onStalled Failed to fetch data, but trying.", event.target.id);
    if (event.target.id === "vid_1") {
      console.log("vid1 stalled");
      refsById["vid_1"].current.play();
    }
    if (event.target.id === "vid_2") {
      console.log("vid2 stalled");
      refsById["vid_2"].current.play();
    }
    //setPlayerTimeOnPause();
  };
  const onTimeUpdate = (event) => {
    let percentage1, percentage2;
    //if (event.target.id === "vid_1") {
    percentage1 = Math.round(
      (refsById["vid_1"].current?.currentTime /
        refsById["vid_1"].current.duration) *
        100
    );
    //setVideoOnePercentPlayed(percentage1);
    console.log(
      "Video1 played in percentage",
      percentage1,
      "duration",
      refsById["vid_1"].current.duration,
      "CurrentTime",
      refsById["vid_1"].current.currentTime
    );
    //}
    //if (event.target.id === "vid_2") {
    percentage2 = Math.round(
      (refsById["vid_2"].current?.currentTime /
        refsById["vid_2"].current.duration) *
        100
    );
    //setVideoTwoPercentPlayed(percentage2);
    console.log(
      "Video2 played in percentage",
      percentage2,
      "duration",
      refsById["vid_2"].current.duration,
      "CurrentTime",
      refsById["vid_2"].current.currentTime,
      "readState",
      refsById["vid_2"].current.media.readyState
    );
    console.log("Factor:", percentage1 / percentage2);
    //}

    //console.log("prevOneVideoPrecentRef",prevOneVideoPrecentRef.current)
    //console.log("prevTwoVideoPrecentRef",prevTwoVideoPrecentRef.current)
    // console.log(
    //   "percentage VideoPlayed video2",
    //   "video1:",
    //   percentage1,
    //   "video2:",
    //   percentage2
    // );
    // console.log("Factor video2/video1", percentage2 / percentage1);
    //console.log("Factor video1/video2", percentage1/percentage2);
  };

  const onPause = (event) => {
    console.log("onPause event", event.target.src);
  };

  const onRateChanged = (event) => {
    console.log("onRateChanged", event);
  };

  // const postStallEvent = (event) => {
  //     let currentTimeStampOfPlayer2 = initialTimeStamp;
  // }
  return (
    <div className="App">
      <h1>Sync two videos</h1>
      <input
        onChange={handleChange}
        type="text"
        placeholder="Enter the video json"
      />
      <button onClick={handleClick}>Load Videos</button>
      <div className="videoContainer">
        {data.length > 0 &&
          data.map((video, i) => {
            return (
              <>
                <div
                  key={`${video.source}_${i}`}
                  className="overlay"
                  id={video.source}
                >
                  {video.source}
                </div>
                <video
                  ref={refsById[video.source]}
                  key={`${video.source}_${i}_${video.recordingStartTimestamp}`}
                  controls
                  width="50%"
                  height="50%"
                  src={video.downloadUrl}
                  onEnded={handleOnEnded}
                  onPlaying={onPlaying}
                  onCanPlayThrough={onCanPlayThrough}
                  onStalled={onStalled}
                  onTimeUpdate={onTimeUpdate}
                  onPause={onPause}
                  preload
                  onRateChange={onRateChanged}
                  id={`${video.source}`}
                />
              </>
            );
          })}
      </div>
      {/* <progress
        onClick={handleProgressbarSeek}
        id="progress-bar"
        min="0"
        max="100"
        value="90"
      >
        0% played
      </progress> */}
      <div>Sync videos</div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
}
