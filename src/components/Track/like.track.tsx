"use client";
import Chip from "@mui/material/Chip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface IProps {
  track: ITrackTop | null;
}
const LikeTrack = (props: IProps) => {
  const { track } = props;
  const { data: session } = useSession();
  const router = useRouter();
  const secretValidate = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
  const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);

  const fetchData = async () => {
    if (session?.access_token) {
      const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `http://localhost:8000/api/v1/likes`,
        method: "GET",
        queryParams: {
          current: 1,
          pageSize: 100,
          sort: "-createdAt",
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      if (res2?.data?.result) setTrackLikes(res2?.data?.result);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const handleLikeTrack = async () => {
    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
      url: `http://localhost:8000/api/v1/likes`,
      method: "POST",
      body: {
        track: track?._id,
        quantity: trackLikes?.some((t) => t._id === track?._id) ? -1 : 1,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    fetchData();
    await sendRequest<IBackendRes<any>>({
      url: `/api/revalidate`,
      method: "POST",
      queryParams: {
        tag: "track-by-id",
        secret: secretValidate,
      },
    });
    router.refresh();
  };
  return (
    <div
      style={{
        margin: "20px 10px 0 10px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Chip
        onClick={() => handleLikeTrack()}
        sx={{ borderRadius: "5px" }}
        size="medium"
        variant="outlined"
        color={
          trackLikes?.some((t) => t._id === track?._id) ? "error" : "default"
        }
        clickable
        icon={<FavoriteIcon />}
        label="Like"
      />
      <div
        style={{ display: "flex", width: "100px", gap: "20px", color: "#999" }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <PlayArrowIcon sx={{ fontSize: "20px" }} /> {track?.countPlay}
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FavoriteIcon sx={{ fontSize: "20px" }} /> {track?.countLike}
        </span>
      </div>
    </div>
  );
};

export default LikeTrack;
