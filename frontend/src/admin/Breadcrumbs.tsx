import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { useWindowDimensions } from "../hooks";

type BreadcrumbsProps = {
  /**
   * The items given in a hierarchical order.
   */
  items: any[];
  /**
   * The number of pixels below which the orientation will be vertical.
   */
  widthToChangeOrientation?: number;
  [props: string]: any;
};

function Breadcrumbs({
  items,
  widthToChangeOrientation = 300,
  ...props
}: BreadcrumbsProps) {
  const { width: windowWidth } = useWindowDimensions();
  const isVertical = Boolean(windowWidth <= widthToChangeOrientation);
  return (
    <nav aria-label="Breadcrumb" className="admin-breadcrumbs" {...props}>
      <ol className={`admin-breadcrumbs__list ${isVertical ? "vertical" : ""}`}>
        {items.map((item, index) => (
          <li className="admin-breadcrumbs__item" key={index}>
            {index > 0 && (
              <KeyboardArrowRightIcon
                fontSize="large"
                className="admin-breadcrumbs__icon"
              />
            )}
            {item}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
