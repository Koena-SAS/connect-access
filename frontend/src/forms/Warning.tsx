import warning from "../images/warning.png";

type WarningProps = {
  /**
   * The warning text to display.
   */
  text: string;
  containerClassName?: string;
};

/**
 * Displays the given text with an image indicating a warning block.
 * Other props are passed to the container div.
 */
function Warning({ text, containerClassName, ...props }: WarningProps) {
  return (
    <div
      className={`warning ${containerClassName ? containerClassName : ""}`}
      {...props}
    >
      <img className="warning__image" src={warning} alt="" />
      <p className="warning__text">{text}</p>
    </div>
  );
}

export default Warning;
