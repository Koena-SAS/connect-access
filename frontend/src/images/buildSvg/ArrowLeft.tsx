import { SVGProps } from "react";

const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={512}
    viewBox="0 0 32 32"
    width={512}
    {...props}
  >
    <path d="M18.859 28a.017.017 0 0 0 .012-.029L6.9 16 18.87 4.029A.017.017 0 0 0 18.86 4h-4.96L2.113 15.788a.3.3 0 0 0 0 .424L13.9 28Z" />
    <path d="M29.859 28a.017.017 0 0 0 .012-.029L17.9 16 29.87 4.029A.017.017 0 0 0 29.86 4h-4.96L13.113 15.788a.3.3 0 0 0 0 .424L24.9 28Z" />
  </svg>
);

export default SvgArrowLeft;
