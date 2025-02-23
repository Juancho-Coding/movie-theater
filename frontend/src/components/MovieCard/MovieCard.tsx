import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  useMediaQuery,
} from "@mui/material";

import classes from "./MovieCard.module.css";
import { useState } from "react";
import Times from "./Times";

const MovieCard = ({
  id,
  title,
  description,
  chips = [],
  imageUrl,
  times = [],
}: props) => {
  const [hovered, setHovered] = useState(false);
  // flag that indeicates when the screen is less than 500px
  const minimalView = useMediaQuery("(max-width: 500px)");

  return (
    <Card
      className={`${classes["card-content"]} ${
        minimalView ? classes["card-content_minimal"] : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardMedia
        className={`${classes["card-media-img"]} ${
          minimalView ? classes["card-media-img_minimal"] : ""
        }`}
        component="img"
        alt={imageUrl.alt}
        image={imageUrl.url}
      />

      <CardContent
        className={`${classes["info-content"]} ${
          minimalView ? classes["info-content_minimal"] : ""
        } ${hovered ? classes["info-content_minimal_hover"] : ""}`}
      >
        <Typography gutterBottom variant="h5">
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
        {/* container for chips */}
        <Box className={classes["chips-content"]}>
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
        {/* container for showtimes */}
        <Box className={classes["times-container"]}>
          <Typography sx={{ textDecoration: "underline" }}>
            Select Movie time
          </Typography>
          <Box className={classes["times"]}>
            {times.map((element) => {
              return <Times key={element} time={element} link={element} />;
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

interface props {
  id: string;
  title: string;
  description: string;
  imageUrl: { url: string; alt: string };
  chips: string[];
  times: string[];
}

export default MovieCard;
