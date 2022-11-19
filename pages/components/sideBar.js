import React, { useState, useEffect } from "react";
import { Star } from "@mui/icons-material";
import axios from "axios";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

export default function SideBar(param) {
  const [dataCategory, setDataCategory] = useState([]);

  const getData = async () => {
    await axios
      .get("/api/gm21/?d=category")
      .then((res) => {
        setDataCategory(res.data);
      })
      .catch(() => alert("Error : Kesalahan Server"));
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton
          selected={"" === param.activeCategory}
          onClick={() => param.getCategoryData("", 1)}
        >
          <ListItemIcon>
            <Star />
          </ListItemIcon>

          <ListItemText primary={"Semua"} />
        </ListItemButton>
      </ListItem>
      {dataCategory.map((data, id) => (
        <ListItem key={id} disablePadding>
          <ListItemButton
            selected={
              data.link.split("/")[data.link.split("/").length - 2] ===
              param.activeCategory
            }
            onClick={() =>
              param.getCategoryData(
                data.link.split("/")[data.link.split("/").length - 2],
                1
              )
            }
          >
            <ListItemIcon>
              <Star />
            </ListItemIcon>

            <ListItemText primary={data.cat} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
