"use client";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/Toast";
import Image from "next/image";
const url = process.env.NEXT_PUBLIC_RENDER;

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel(props: IProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={props.trackUpload.percent} />
    </Box>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function InputFileUpload(props: any) {
  const { setInfo, info } = props;
  const { data: session } = useSession();
  const toast = useToast();
  const handleUploadImg = async (image: any) => {
    const formData = new FormData();
    formData.append("fileUpload", image);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            target_type: "images",
          },
        }
      );
      setInfo({
        ...info,
        imgUrl: res.data.data.fileName,
      });
    } catch (error) {
      //@ts-ignore
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      sx={{
        mt: 5,
        borderColor: "#f78500",
        backgroundColor: "#f78500",
        "&:hover": {
          backgroundColor: "#f78500",
          borderColor: "#ff9900",
        },
      }}
      onChange={(e) => {
        const event = e.target as HTMLInputElement;
        if (event.files) {
          handleUploadImg(event.files[0]);
        }
      }}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}

interface IProps {
  trackUpload: {
    fileName: string;
    percent: number;
    uploadedTrackName: string;
  };
  setValue: (v: number) => void;
}
interface INewTrack {
  title: string;
  description: string;
  trackUrl: string;
  imgUrl: string;
  category: string;
}
const Step2 = (props: IProps) => {
  const { trackUpload, setValue } = props;
  // console.log(">>> check trackUpload: ", trackUpload);
  const [info, setInfo] = useState<INewTrack>({
    title: "",
    description: "",
    trackUrl: "",
    imgUrl: "",
    category: "",
  });
  const category = [
    {
      value: "CHILL",
      label: "CHILL",
    },
    {
      value: "WORKOUT",
      label: "WORKOUT",
    },
    {
      value: "PARTY",
      label: "PARTY",
    },
  ];
  const secretValidate = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
  const { data: session } = useSession();
  const toast = useToast();
  const handleSubmitForm = async () => {
    const res = await sendRequest<IBackendRes<ITrackTop>>({
      url: "http://localhost:8000/api/v1/tracks",
      method: "POST",
      body: {
        title: info?.title,
        description: info?.description,
        trackUrl: info?.trackUrl,
        imgUrl: info?.imgUrl,
        category: info?.category,
      },
      queryParams: {
        sort: "-createdAt",
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      toast.success(res.message);
      setValue(0);
      await sendRequest<IBackendRes<any>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          tag: "track-by-id",
          secret: secretValidate,
        },
      });
    } else {
      toast.error(res.message);
    }
  };
  useEffect(() => {
    if (trackUpload && trackUpload.uploadedTrackName) {
      setInfo({ ...info, trackUrl: trackUpload.uploadedTrackName });
    }
  }, [trackUpload]);

  return (
    <div>
      <div>
        <div>{trackUpload.fileName}</div>
        <LinearWithValueLabel trackUpload={trackUpload} setValue={setValue} />
      </div>

      <Grid container spacing={2} mt={5}>
        <Grid
          item
          xs={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ height: "100%", width: 250, background: "#ccc" }}>
            <div style={{ height: 250, width: 250, position: "relative" }}>
              {info.imgUrl && (
                <Image
                  src={`${url}images/${info.imgUrl}`}
                  layout="fill"
                  objectFit="contain"
                  alt="alo"
                />
              )}
            </div>
          </div>
          <div>
            <InputFileUpload setInfo={setInfo} info={info} />
          </div>
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField
            value={info?.title}
            onChange={(e) =>
              setInfo({
                ...info,
                title: e.target.value,
              })
            }
            label="Title"
            variant="standard"
            fullWidth
            margin="dense"
          />
          <TextField
            value={info?.description}
            onChange={(e) =>
              setInfo({
                ...info,
                description: e.target.value,
              })
            }
            label="Description"
            variant="standard"
            fullWidth
            margin="dense"
          />
          <TextField
            sx={{
              mt: 3,
            }}
            value={info?.category}
            select
            label="Category"
            fullWidth
            variant="standard"
            onChange={(e) =>
              setInfo({
                ...info,
                category: e.target.value,
              })
            }
          >
            {category.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            sx={{
              mt: 5,
              borderColor: "#f78500",
              background: "#f78500",
              color: "#ffff",
              "&:hover": {
                background: "#ff9900",
                borderColor: "#f78500",
              },
            }}
            onClick={() => handleSubmitForm()}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Step2;
