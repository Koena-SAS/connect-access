import * as React from "react";

function SvgArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      height={512}
      viewBox="0 0 32 32"
      width={512}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13.041 28a.017.017 0 01-.012-.029L25 16 13.029 4.029A.017.017 0 0113.041 4H18l11.788 11.788a.3.3 0 010 .424L18 28z" />
      <path d="M2.041 28a.017.017 0 01-.012-.029L14 16 2.029 4.029A.017.017 0 012.041 4H7l11.788 11.788a.3.3 0 010 .424L7 28z" />
    </svg>
  );
}

export default SvgArrowRight;
