import WaveTrack from "@/components/WaveTrack/wave.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = (temp[0]?.split("-") ?? []) as string[];
  const id = temp1[temp1.length - 1];
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${url}/${id}`,
    method: "GET",
  });
  return {
    title: res.data?.title,
    description: res.data?.description,
    openGraph: {
      title: "Alo Ha",
      description: "Beyond Your Coding Skills",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`,
      ],
    },
  };
}

const DetailTrackPage = async (props: any) => {
  const { params } = props;
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = (temp[0]?.split("-") ?? []) as string[];
  const id = temp1[temp1.length - 1];
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${url}/${id}`,
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
        trackId: id,
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
