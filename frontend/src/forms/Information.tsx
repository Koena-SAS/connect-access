import InformationIcon from "../images/buildSvg/Information";

type InformationProps = {
  /**
   * The info text to display.
   */
  text: string;
  containerClassName?: string;
  [props: string]: any;
};

/**
 * Displays the given text with an image indicating an information block.
 * Other props are passed to the container element.
 */
function Information({ text, containerClassName, ...props }: InformationProps) {
  return (
    <p
      className={`information ${containerClassName ? containerClassName : ""}`}
      {...props}
    >
      <InformationIcon aria-hidden={true} className="information__image" />
      {text}
    </p>
  );
}

export default Information;
