import { ReactNode } from "react";

type TableProps = {
  /**
   * Array of information about each table head element.
   */
  headsInfos: { text: ReactNode }[];
  /**
   * Array of information about each rows. Each row information is itself
   * an array of information about each cell.
   */
  rowsInfos: {
    key: string;
    infos: {
      text: ReactNode;
    }[];
  }[];
  /**
   * The hidden text of the caption for the table.
   */
  captionText: string;
  /**
   * class name on the table element.
   */
  className?: string;
  /**
   * Starts displaying the mobile display fo the table from the indicated number of pixels.
   */
  mobileModeFrom?: 1200 | 1400 | 1600 | 1800;
};

/**
 * Display a simple table with heading values at the top, and rows below.
 * When on mobile view the heading is on the left of each row.
 */
function Table({
  rowsInfos,
  captionText,
  headsInfos,
  className,
  mobileModeFrom = 1400,
}: TableProps) {
  return (
    <table
      className={`table mobileModeFrom${mobileModeFrom} ${
        className ? className : ""
      }`}
    >
      <caption className="table__title">{captionText}</caption>
      <thead className="table__head">
        <tr>
          {headsInfos.map((headInfos, index) => {
            return (
              <th scope="col" key={index}>
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

export default Table;
