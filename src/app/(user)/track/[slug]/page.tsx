"use client";
import WaveTrack2 from "@/components/WaveTrack/watrack";
import WaveTrack from "@/components/WaveTrack/wave.track";
import { Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React from "react";

const DetailTrackPage = (props: any) => {
  const { params } = props;
  const searchParams = useSearchParams();
  const search = searchParams.get("audio");

  return (
    <Container>
      <div>
        <WaveTrack />
        {/* <WaveTrack2 /> */}
      </div>
    </Container>
  );
};

export default DetailTrackPage;
