import WaveTrack from "@/components/WaveTrack/wave.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import React from "react";

const DetailTrackPage = async (props: any) => {
  const { params } = props;
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${url}/${params.slug}`,
    method: "GET",
    nextOption: {
      next: { tags: ["track-by-id"] },
    },
  });
  const comment = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>(
    {
      url: `${url}/comments`,
      method: "POST",
      queryParams: {
        current: 1,
        pageSize: 10,
        trackId: params.slug,
        sort: "-createdAt",
      },
    }
  );
  return (
    <Container>
      <div>
        <WaveTrack
          track={res?.data ?? null}
          comment={comment?.data?.result ?? null}
        />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
