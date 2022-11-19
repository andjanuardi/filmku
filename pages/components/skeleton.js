import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Box, Stack } from "@mui/material";

export default function LoadMedia() {
  return (
    <Stack
      direction={"row"}
      sx={{ flexWrap: "wrap", justifyContent: "center" }}
    >
      {Array.from(new Array(20)).map((text, id) => (
        <Stack key={id} sx={{ margin: "10px" }} spacing={1}>
          <Skeleton variant="rounded" width={150} height={250} />
          <Skeleton variant="rounded" width={150} height={50} />
          <Skeleton variant="rounded" width={150} height={30} />
        </Stack>
      ))}
    </Stack>
  );
}
