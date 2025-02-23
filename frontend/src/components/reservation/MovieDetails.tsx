import { Box, Chip, Typography } from "@mui/material";

import classes from "./MovieDetails.module.css";

const MovieDetails = ({
  flexGrow,
  title,
  description,
  chips,
  imageUrl,
}: props) => {
  return (
    <Box flexGrow={flexGrow} className={classes["details-container"]}>
      <Box>
        <Typography variant="h5" fontWeight="800">
          {title}
        </Typography>
      </Box>
      <Box className={classes["image-container"]}>
        <img
          className={classes["image"]}
          src={imageUrl.url}
          alt={imageUrl.alt}
        />
      </Box>
      <Typography variant="h6" sx={{ textDecoration: "underline" }}>
        Description
      </Typography>
      <Typography
        variant="body2"
        noWrap={false}
        sx={{
          wordBreak: "break-word", // Break long words
          overflowWrap: "break-word",
        }}
      >
        {description}
      </Typography>
      <Box className={classes["chips-container"]}>
        {chips.map((element) => {
          return (
            <Chip
              key={element}
              color="secondary"
              label={element}
              size="small"
            />
          );
        })}
      </Box>
      <Box className={classes.band}></Box>
    </Box>
  );
};

interface props {
  title: string;
  description: string;
  id: string;
  chips: string[];
  imageUrl: { url: string; alt: string };
  flexGrow: number;
}

export default MovieDetails;
