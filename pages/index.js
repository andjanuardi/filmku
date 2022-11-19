import React from "react";
import { styled, useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import TabelFilm from "./components/tabelFilm";
import SideBar from "./components/sideBar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import MediaPlayer from "./components/player";
import Head from "next/head";

const drawerWidth = 240;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [dataFilm, setDataFilm] = useState([]);
  const [state, setState] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [openPlayer, setOpenPlayer] = useState(false);
  const [activePlayer, setActivePlayer] = useState([]);

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const getDataFilm = (page) => {
    setDataFilm([]);

    async function getStaticProps() {
      await axios
        .get(`/api/gm21/?d=movie&p=${page}`, config)
        .then((res) => {
          setDataFilm(res.data);
        })
        .catch(() => alert("Error : Kesalahan Server"));
    }
    getStaticProps();
  };

  const cari = async (page, val) => {
    setDataFilm([]);
    setState("Cari");
    setActiveSearch(val);
    setActivePage(page);
    await axios
      .get(`/api/gm21/?d=movie&p=${page}&s=${val}`, config)
      .then((res) => {
        setDataFilm(res.data);
      })
      .catch(() => alert("Error : Kesalahan Server"));
  };

  const getCategoryData = async (c, p) => {
    setDataFilm([]);
    setState("Category");
    setActiveCategory(c);
    setActivePage(p);

    await axios
      .get(`/api/gm21/?d=movie&c=${c}&p=${p}`, config)
      .then((res) => {
        setDataFilm(res.data);
      })
      .catch(() => alert("Error : Kesalahan Server"));
  };

  useEffect(() => {
    getDataFilm(activePage);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Head>
        <title>FILM KU</title>
      </Head>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            onClick={() => document.location.reload()}
            variant="h6"
            noWrap
            component="div"
            sx={{ cursor: "pointer" }}
          >
            FILM KU
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper sx={{ cursor: "pointer" }}>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onKeyDown={(e) => e.key === "Enter" && cari(1, e.target.value)}
              placeholder="Cari.."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography ml={2} variant={"h5"}>
            Kategori
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <SideBar
          setDataFilm={setDataFilm}
          setActiveCategory={setActiveCategory}
          activeCategory={activeCategory}
          setState={setState}
          setActivePage={setActivePage}
          getCategoryData={getCategoryData}
        />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box sx={{ justifyContent: "center", alignItems: "center" }}>
          <TabelFilm
            dataFilm={dataFilm}
            setActivePage={setActivePage}
            activePage={activePage}
            state={state}
            activeCategory={activeCategory}
            activeSearch={activeSearch}
            getDataFilm={getDataFilm}
            getCategoryData={getCategoryData}
            cari={cari}
            setOpenPlayer={setOpenPlayer}
            setActivePlayer={setActivePlayer}
          />
        </Box>
      </Main>
      {openPlayer && (
        <MediaPlayer
          open={openPlayer}
          setOpen={setOpenPlayer}
          activePlayer={activePlayer}
        />
      )}
    </Box>
  );
}
