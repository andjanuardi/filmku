import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Chip, Pagination, Stack } from "@mui/material";
import LoadMedia from "./skeleton";

export default function TabelFilm(param) {
  const changePage = (e, page) => {
    if (param.state === "") {
      param.setActivePage(page);
      if (param.activeCategory === "" || param.activeSearch === "") {
        param.getDataFilm(page);
      }
    }
    if (param.state === "Category") {
      param.setActivePage(page);
      param.getCategoryData(param.activeCategory, page);
    }
    if (param.state === "Cari") {
      param.setActivePage(page);
      param.cari(page, param.activeSearch);
    }
  };

  const playMovie = (data) => {
    param.setOpenPlayer(true);
    param.setActivePlayer(data);
  };

  return (
    <>
      <Stack
        direction={"row"}
        sx={{ flexWrap: "wrap", justifyContent: "center" }}
      >
        {typeof param.dataFilm !== "undefined" &&
          param.dataFilm.length <= 0 && <LoadMedia />}

        {typeof param.dataFilm !== "undefined" &&
          typeof param.dataFilm.movie !== "undefined" &&
          param.dataFilm.movie.map((data, id) => (
            <Card
              key={id}
              sx={{ maxWidth: 150, margin: "10px" }}
              onClick={() => playMovie(data)}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="250px"
                  image={data.imgUrl}
                  alt="NO IMAGE"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {data.title} <small>({data.year})</small>
                  </Typography>
                  {data.quality !== "" && (
                    <Chip
                      size="small"
                      color="success"
                      label={data.quality}
                      sx={{ marginRight: "5px" }}
                    />
                  )}
                  <Chip size="small" color="warning" label={data.rating} />
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
      </Stack>
      {typeof param.dataFilm !== "undefined" &&
        typeof param.dataFilm.page !== "undefined" &&
        param.dataFilm.page.last !== null && (
          <Stack spacing={2} alignItems={"center"}>
            <Pagination
              count={param.dataFilm.page.last}
              defaultPage={param.activePage}
              onChange={changePage}
              color="primary"
            />
          </Stack>
        )}
    </>
  );
}
