import PropTypes from "prop-types";

/**
 * Display a simple table with heading values at the top, and rows below.
 * When on mobile view the heading is on the left of each row.
 */
function Table({
  rowsInfos,
  captionText,
  headsInfos,
  className,
  mobileModeFrom,
}) {
  return (
    <table
      className={`table mobileModeFrom${mobileModeFrom} ${
        className ? className : ""
      }`}
    >
      <caption className="table__title">{captionText}</caption>
      <thead className="table__head">
        <tr>
          {headsInfos.map((headInfos) => {
            return (
              <th scope="col" key={headInfos.text}>
                {headInfos.text}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rowsInfos.map((cellsInfos) => {
          return (
            <tr key={cellsInfos.key} className="table__data-row">
              {cellsInfos.infos.map((cellInfos, cellIndex) => {
                return (
                  <td data-label={headsInfos[cellIndex].text} key={cellIndex}>
                    {cellInfos.text}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Table.defaultProps = {
  mobileModeFrom: 1400,
};

Table.propTypes = {
  /**
   * Array of information about each table head element.
   */
  headsInfos: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    })
  ).isRequired,
  /**
   * Array of information about each rows. Each row information is itself
   * an array of information about each cell.
   */
  rowsInfos: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      infos: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
            .isRequired,
        })
      ),
    }).isRequired
  ).isRequired,
  /**
   * The hidden text of the caption for the table.
   */
  captionText: PropTypes.string.isRequired,
  /**
   * class name on the table element.
   */
  className: PropTypes.string,
  /**
   * Starts displaying the mobile display fo the table from the indicated number of pixels.
   */
  mobileModeFrom: PropTypes.oneOf([1200, 1400, 1600, 1800]),
};

export default Table;
