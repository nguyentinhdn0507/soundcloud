"use client";
import { createContext, useContext, useState } from "react";

export const TrackContext = createContext<ITrackContext | null>(null);

export function TrackContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initValue = {
    _id: "",
    title: "",
    description: "",
    category: "",
    imgUrl: "",
    trackUrl: "",
    countLike: 0,
    countPlay: 0,
    uploader: {
      _id: "",
      email: "",
      name: "",
      role: "",
      type: "",
    },
    isDeleted: false,
    createdAt: "",
    updatedAt: "",
    isPlaying: false,
  };
  const [currentTrack, setCurrentTrack] = useState<IShareTrack>(initValue);

  return (
    <TrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
      {children}
    </TrackContext.Provider>
  );
}
export const useTrackContext = () => useContext(TrackContext);
