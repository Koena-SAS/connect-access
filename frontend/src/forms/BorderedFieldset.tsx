import { useMemo } from "react";
import slugify from "react-slugify";

type BorderFieldsetProps = {
  /**
   * The text of the legend.
   */
  legend: string;
  /**
   * The level of the title html element. If not given, the legend will
   * be in a div.
   */
  level?: number;
  fieldsetClassName?: string;
  legendClassName?: string;
  children: any;
  smallMarginTop?: boolean;
  smallPaddingTop?: boolean;
  [props: string]: any;
};

/**
 * Displays fieldset encapsulating form elements with legend above
 * the border.
 * Other props are passed to the container div.
 */
function BorderedFieldset({
  legend,
  level,
  fieldsetClassName,
  legendClassName,
  children,
  smallMarginTop,
  smallPaddingTop,
  ...props
}: BorderFieldsetProps) {
  const legendId = useMemo(() => slugify(legend), [legend]);
  const legendElement = useMemo(() => {
    const legendProps = {
      id: legendId,
      className: `fieldset-border__legend ${
        legendClassName ? legendClassName : ""
      } ${smallMarginTop ? "smallMarginTop" : ""}`,
    };
    switch (level) {
      case 1:
        return <h1 {...legendProps}>{legend}</h1>;
      case 2:
        return <h2 {...legendProps}>{legend}</h2>;
      case 3:
        return <h3 {...legendProps}>{legend}</h3>;
      case 4:
        return <h4 {...legendProps}>{legend}</h4>;
      case 5:
        return <h5 {...legendProps}>{legend}</h5>;
      case 6:
        return <h6 {...legendProps}>{legend}</h6>;
      default:
        return <div {...legendProps}>{legend}</div>;
    }
  }, [level, legend, legendClassName, legendId, smallMarginTop]);
  return (
    <>
      {legendElement}
      <div
        role="group"
        aria-labelledby={legendId}
        className={`fieldset-border ${
          fieldsetClassName ? fieldsetClassName : ""
        } ${smallPaddingTop ? "smallPaddingTop" : ""}`}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export default BorderedFieldset;
