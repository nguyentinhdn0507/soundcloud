"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box } from "@mui/material";
import Button from "@mui/material/Button/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import Image from "next/image";
import { convertSlugUrl } from "@/utils/api";

interface IProps {
  data: ITrackTop[];
  title: string;
}

const MainSlider = (props: IProps) => {
  const { data, title } = props;
  const renderUI = process.env.NEXT_PUBLIC_RENDER;
  const NextArrow = (props: any) => {
    return (
      <Button
        color="inherit"
        variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          right: 25,
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronRightIcon />
      </Button>
    );
  };

  const PrevArrow = (props: any) => {
    return (
      <Button
        color="inherit"
        variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronLeftIcon />
      </Button>
    );
  };

  const settings: Settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Box
      sx={{
        margin: "0 50px",
        ".track": {
          padding: "0 10px",
        },
        h3: {
          border: "1px solid #ccc",
          padding: "20px",
          height: "200px",
        },
      }}
    >
      <h2> {title} </h2>
      <Slider {...settings}>
        {data &&
          data.map((track) => {
            return (
              <div className="track" key={track._id}>
                <div
                  style={{
                    position: "relative",
                    height: "150px",
                    width: "100%",
                  }}
                >
                  <Image
                    alt="list track image"
                    src={`${renderUI}images/${track.imgUrl}`}
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
                <Link
                  href={`/track/${convertSlugUrl(track?.title)}-${
                    track._id
                  }.html?audio=${track.trackUrl}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <h4>{track.title}</h4>
                </Link>
                <h5>{track.description}</h5>
              </div>
            );
          })}
      </Slider>
      <Divider />
    </Box>
  );
};

export default MainSlider;
