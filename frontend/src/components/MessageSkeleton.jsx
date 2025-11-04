import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function MessageSkeleton() {
  return (
    <Box sx={{ width: "100%", maxWidth: 320, mt: 1 }}>
      <Skeleton
        variant="rounded"
        height={20}
        width="120%"
        animation="wave"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.15)",
          "&::after": {
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          },
          borderRadius: 3,
          mb: 1,
        }}
      />

      <Skeleton
        variant="rounded"
        height={20}
        width="100%"
        animation="wave"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.15)",
          "&::after": {
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          },
          borderRadius: 3,
          mb: 1,
        }}
      />

      <Skeleton
        variant="rounded"
        height={20}
        width="80%"
        animation="wave"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.15)",
          "&::after": {
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          },
          borderRadius: 3,
        }}
      />
    </Box>
  );
}
