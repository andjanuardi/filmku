import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Pagination,
  Skeleton,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MediaPlayer(param) {
  const [streamLink, setStreamLink] = useState("");
  const [episodeList, setEpisodeList] = useState([]);
  const [episode, setEpisode] = useState(false);
  const handleClose = () => {
    param.setOpen(false);
  };

  const getStreamLink = async (link) => {
    setStreamLink("");

    await axios
      .get(`/api/gm21/?d=player&l=${link}`)
      .then((res) => {
        if (typeof res.data.link === "string") {
          setStreamLink(res.data.link);
          setEpisode(false);
        }
        if (typeof res.data.link === "object" && res.data.link !== null) {
          setEpisodeList(res.data.link);
          getStreamLinkEpisode(
            res.data.link[0].url.split("/")[
              res.data.link[0].url.split("/").length - 1
            ]
          );
          setEpisode(true);
        }
      })
      .catch(() => alert("Error : Kesalahan Server"));
  };
  const getStreamLinkEpisode = async (link) => {
    setStreamLink("");
    await axios
      .get(`/api/gm21/?d=player&l=${link}`)
      .then((res) => {
        typeof res.data.link === "string" && setStreamLink(res.data.link);
      })
      .catch(() => alert("Error : Kesalahan Server"));
  };
  const changePage = (e, page) => {
    getStreamLinkEpisode(
      episodeList[page - 1].url.split("/")[
        episodeList[page - 1].url.split("/").length - 1
      ]
    );
  };
  useEffect(() => {
    getStreamLink(
      param.activePlayer.link.split("/")[
        param.activePlayer.link.split("/").length - 2
      ]
    );
  }, []);

  return (
    <div>
      <Dialog
        fullScreen
        open={param.open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {param.activePlayer.title}
            </Typography>
          </Toolbar>
        </AppBar>

        <Stack direction={"row"} mr={2} ml={2} sx={{ flexWrap: "wrap" }}>
          <Card sx={{ maxWidth: 250, margin: "10px", maxHeight: "500px" }}>
            <CardMedia
              component="img"
              height="350px"
              image={param.activePlayer.imgUrl}
              alt="NO IMAGE"
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="subtitle2"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {param.activePlayer.title}{" "}
                <small>({param.activePlayer.year})</small>
              </Typography>
              {param.activePlayer.quality !== "" && (
                <Chip
                  size="small"
                  color="success"
                  label={param.activePlayer.quality}
                  sx={{ marginRight: "5px" }}
                />
              )}
              <Chip
                size="small"
                color="warning"
                label={param.activePlayer.rating}
              />
            </CardContent>
          </Card>
          <Card sx={{ flexGrow: 1, margin: "10px", minHeight: "80vh" }}>
            {typeof episodeList !== "undefined" && episode === true && (
              <CardContent>
                <Stack xs={{ flexGrow: 1 }} spacing={2} alignItems={"center"}>
                  <strong>EPISODE</strong>
                  <Pagination
                    count={episodeList.length}
                    onChange={changePage}
                    color="primary"
                  />
                </Stack>
              </CardContent>
            )}

            {typeof streamLink === "string" && (
              <iframe
                allowFullScreen={true}
                style={{ height: "80vh", border: "none", width: "100%" }}
                src={streamLink}
              />
            )}
            {typeof streamLink === "" && (
              <Skeleton
                variant="rounded"
                width={"100%"}
                height={"80vh"}
              ></Skeleton>
            )}
          </Card>
        </Stack>
      </Dialog>
    </div>
  );
}
