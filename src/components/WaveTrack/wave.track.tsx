"use client";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWaveSurfer } from "@/utils/customHook";
import { WaveSurferOptions } from "wavesurfer.js";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import "./wave.scss";
import { useTrackContext } from "@/lib/track.wrapper";
import { Tooltip } from "@mui/material";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import CommentTrack from "../Track/comment.track";
import LikeTrack from "../Track/like.track";
import Image from "next/image";
interface IProps {
  track: ITrackTop | null;
  comment: ITrackComment[] | null;
}
const WaveTrack = (props: IProps) => {
  const { track, comment } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileName = searchParams.get("audio");
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const firstViewRef = useRef(true);
  const url = process.env.NEXT_PUBLIC_RENDER;
  // const [time, setTime] = useState<String>("0:00");
  // const [duration, setDuration] = useState<String>("0:00");
  const timeRef = useRef<HTMLDivElement | null>(null);
  const secretValidate = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
  const durationRef = useRef<HTMLDivElement | null>(null);
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
  const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
    let gradient, progressGradient;
    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      // Define the waveform gradient
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      gradient.addColorStop(0, "#656666"); // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
      gradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#B1B1B1"
      ); // Bottom color
      gradient.addColorStop(1, "#B1B1B1"); // Bottom color

      // Define the progress gradient
      progressGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height * 1.35
      );
      progressGradient.addColorStop(0, "#EE772F"); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7) / canvas.height,
        "#EB4926"
      ); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#F6B094"
      ); // Bottom color
      progressGradient.addColorStop(1, "#F6B094"); // Bottom color
    }
    return {
      waveColor: gradient,
      progressColor: progressGradient,
      height: 90,
      barWidth: 2,
      url: `/api?audio=${fileName}`,
    };
  }, []);
  const waveSurfer = useWaveSurfer(containerRef, optionsMemo) || null;
  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const waveSurferPlay = () => {
    if (!waveSurfer) return;
    waveSurfer.on("ready", () => {
      waveSurfer.play();
    });
  };
  useEffect(() => {
    if (!waveSurfer) return;
    waveSurferPlay();
    setIsPlaying(false);
    const hover = hoverRef.current!;
    const waveForm = containerRef.current!;
    waveForm?.addEventListener(
      "pointermove",
      //@ts-ignore
      (e) => (hover.style.width = `${e.offsetX}px`)
    );
    const subscriptions = [
      waveSurfer.on("play", () => setIsPlaying(true)),
      waveSurfer.on("pause", () => setIsPlaying(false)),
      waveSurfer.on("decode", (duration) => {
        // setDuration(formatTime(duration));
        if (durationRef.current)
          durationRef.current.innerText = formatTime(duration);
      }),
      waveSurfer.on("timeupdate", (currentTime) => {
        // setTime(formatTime(currentTime));
        if (timeRef.current)
          timeRef.current.innerText = formatTime(currentTime);
      }),
    ];
    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [waveSurfer]);
  const onPlayClick = useCallback(() => {
    if (waveSurfer) {
      waveSurfer.isPlaying() ? waveSurfer.pause() : waveSurfer.play();
    }
  }, [waveSurfer]);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };
  const calLeft = (moment: number) => {
    const hardCodeDuration = 199;
    const percent = (moment / hardCodeDuration) * 100;
    return `${percent}%`;
  };
  useEffect(() => {
    if (waveSurfer && currentTrack?.isPlaying) {
      waveSurfer.pause();
    }
  }, [currentTrack]);
  useEffect(() => {
    if (track?._id && !currentTrack?._id) {
      setCurrentTrack({ ...track, isPlaying: false });
    }
  }, [track]);
  const handleIncreaseView = async () => {
    if (firstViewRef.current) {
      await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `http://localhost:8000/api/v1/tracks/increase-view`,
        method: "POST",
        body: {
          trackId: track?._id,
        },
      });
      await sendRequest<IBackendRes<any>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          tag: "track-by-id",
          secret: secretValidate,
        },
      });
      router.refresh();
      firstViewRef.current = false;
    }
  };
  return (
    <div style={{ marginTop: 20 }} className="wrapper">
      <div
        style={{
          display: "flex",
          gap: 15,
          padding: 20,
          height: 400,
          background:
            "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)",
        }}
      >
        <div
          className="left"
          style={{
            width: "75%",
            height: "calc(100% - 10px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div className="info" style={{ display: "flex" }}>
            <div>
              <div
                onClick={() => {
                  onPlayClick();
                  handleIncreaseView();
                  if (track && waveSurfer) {
                    setCurrentTrack({
                      ...currentTrack,
                      isPlaying: false,
                    });
                  }
                }}
                style={{
                  borderRadius: "50%",
                  background: "#f50",
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {isPlaying === true ? (
                  <PauseIcon sx={{ fontSize: 30, color: "white" }} />
                ) : (
                  <PlayArrowIcon sx={{ fontSize: 30, color: "white" }} />
                )}
              </div>
            </div>
            <div style={{ marginLeft: 20 }}>
              <div
                style={{
                  padding: "0 5px",
                  background: "#333",
                  fontSize: 30,
                  width: "fit-content",
                  color: "white",
                }}
              >
                {track?.title}
              </div>
              <div
                style={{
                  padding: "0 5px",
                  marginTop: 10,
                  background: "#333",
                  fontSize: 20,
                  width: "fit-content",
                  color: "white",
                }}
              >
                {track?.description}
              </div>
            </div>
          </div>
          <div ref={containerRef} className="wave-form-container">
            <div id="time" className="time" ref={timeRef}></div>
            <div id="duration" className="duration" ref={durationRef}></div>
            <div ref={hoverRef} className="hover-wave"></div>
            <div
              className="overlay"
              style={{
                position: "absolute",
                height: "30px",
                width: "100%",
                bottom: "0",
                backdropFilter: "brightness(0.5)",
              }}
            ></div>
            <div className="comments" style={{ position: "relative" }}>
              {comment &&
                comment.map((item) => {
                  return (
                    <Tooltip title={item.content} arrow key={item._id}>
                      <Image
                        height={20}
                        width={20}
                        onPointerMove={(e) => {
                          const hover = hoverRef.current!;
                          hover.style.width = calLeft(item.moment + 3);
                        }}
                        key={item._id}
                        style={{
                          position: "absolute",
                          top: 71,
                          zIndex: 20,
                          left: calLeft(item.moment),
                        }}
                        src={fetchDefaultImages(item.user.type)}
                        alt="comment"
                      />
                    </Tooltip>
                  );
                })}
            </div>
          </div>
        </div>
        <div
          className="right"
          style={{
            width: "25%",
            padding: 15,
            display: "flex",
            alignItems: "center",
          }}
        >
          {track?.imgUrl ? (
            <Image
              src={`${url}images/${track?.imgUrl}`}
              width={250}
              height={250}
              alt="track image"
            />
          ) : (
            <div
              style={{
                background: "#ccc",
                width: 250,
                height: 250,
              }}
            ></div>
          )}
        </div>
      </div>
      <div>
        <CommentTrack
          comments={comment}
          track={track}
          waveSurfer={waveSurfer}
        />
      </div>
      <div>
        <LikeTrack track={track} />
      </div>
    </div>
  );
};

export default WaveTrack;
