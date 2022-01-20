import { SVGProps } from "react";

const SvgDude = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={143}
    height={167}
    viewBox="0 0 37.835 44.185"
    {...props}
  >
    <path
      className="dude_svg__circle"
      style={{
        fillOpacity: 1,
        stroke: "none",
        strokeWidth: 0.26458332,
        strokeOpacity: 1,
      }}
      d="M192.573 173.187a18.817 18.954 0 0 1-18.817 18.954 18.817 18.954 0 0 1-18.816-18.954 18.817 18.954 0 0 1 18.816-18.953 18.817 18.954 0 0 1 18.817 18.953z"
      transform="translate(-154.807 -154.101)"
    />
    <path
      className="dude_svg__body"
      style={{
        strokeWidth: ".26458332px",
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        strokeOpacity: 1,
        fillOpacity: 1,
      }}
      d="M188.168 198.213s-.433-4.023-2.27-8.01c-1.836-3.988-5.402-7.975-12.318-7.975-6.874 0-10.076 4.209-11.703 7.984-1.734 4.024-2.294 7.984-2.294 7.984l3.25.036s.193-3.087 1.664-6.378c1.506-3.373 4.252-6.673 9.21-6.604 4.957.068 8.163 3.434 9.62 6.652 1.3 2.872 1.746 6.312 1.746 6.312z"
      transform="translate(-154.807 -154.101)"
    />
    <path
      className="dude_svg__head"
      style={{
        fillOpacity: 1,
        strokeWidth: 0.99999994,
        strokeOpacity: 1,
        opacity: 1,
      }}
      d="M72.102 20.934a36.594 36.439 0 0 0-36.594 36.439 36.594 36.439 0 0 0 36.594 36.44 36.594 36.439 0 0 0 36.593-36.44 36.594 36.439 0 0 0-36.593-36.44zm0 12.421A24.69 24.017 0 0 1 96.79 57.373a24.69 24.017 0 0 1-24.69 24.016 24.69 24.017 0 0 1-24.689-24.016 24.69 24.017 0 0 1 24.69-24.018z"
      transform="scale(.26458)"
    />
  </svg>
);

export default SvgDude;
