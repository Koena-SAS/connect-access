import * as React from "react";

function SvgArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={512}
      viewBox="0 0 32 32"
      width={512}
      {...props}
    >
      <path d="M18.859 28a.017.017 0 00.012-.029L6.9 16 18.87 4.029A.017.017 0 0018.86 4h-4.96L2.113 15.788a.3.3 0 000 .424L13.9 28z" />
      <path d="M29.859 28a.017.017 0 00.012-.029L17.9 16 29.87 4.029A.017.017 0 0029.86 4h-4.96L13.113 15.788a.3.3 0 000 .424L24.9 28z" />
    </svg>
  );
}

export default SvgArrowLeft;
