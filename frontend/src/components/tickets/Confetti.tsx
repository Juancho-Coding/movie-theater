import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { dinamicImport } from "../../utils/utils";
import { useWindowSize } from "react-use";

const Confeti = ({ im, size = 1, pieces }: props) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [show, setShow] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const img = new Image();
    img.src = dinamicImport(im); // Make sure the image path is correct
    img.onload = () => setImage(img);
  }, [im]);

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={pieces}
      confettiSource={{
        x: 0,
        y: height,
        w: width,
        h: 0,
      }}
      friction={0.99}
      gravity={0.2}
      run={show}
      drawShape={(ctx: CanvasRenderingContext2D) => {
        if (image) {
          ctx.drawImage(image, -10 * size, -10 * size, 20 * size, 20 * size); // Adjust size as needed
        }
      }}
      onConfettiComplete={() => {
        setShow(false);
      }}
    />
  );
};

interface props {
  im: string;
  size?: number;
  pieces: number;
}

export default Confeti;
