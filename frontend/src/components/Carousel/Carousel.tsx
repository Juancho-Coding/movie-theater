import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import classes from "./Carousel.module.css";
import { dinamicImport } from "../../utils/utils";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
  });

  useEffect(() => {
    const index = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);
    return () => {
      clearInterval(index);
    };
  }, [currentSlide, instanceRef]);

  return (
    <Box width="100%" height="auto" position="relative">
      <Box ref={sliderRef} className="keen-slider">
        <Box className="keen-slider__slide" sx={{ objectFit: "scale-down" }}>
          <img src={dinamicImport("promo1.webp")} width="100%" />
        </Box>
        <Box className="keen-slider__slide" sx={{ objectFit: "scale-down" }}>
          <img src={dinamicImport("promo2.webp")} width="100%" />
        </Box>
        <Box className="keen-slider__slide" sx={{ objectFit: "scale-down" }}>
          <img src={dinamicImport("promo3.webp")} width="100%" />
        </Box>
      </Box>
      {loaded && instanceRef.current && (
        <Box className={classes["dots"]}>
          {[
            ...Array(instanceRef.current.track.details.slides.length).keys(),
          ].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={`${classes.dot} ${
                  currentSlide === idx ? classes.active : ""
                }`}
              ></button>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Carousel;
