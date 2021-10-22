import { render } from "@testing-library/react";
import Snackbar from "./Snackbar";

it("displays a message with role=status when severity is set to success", async () => {
  const { getAllByRole, queryAllByRole } = render(
    <Snackbar
      open={true}
      onClose={() => null}
      notificationText="Text"
      severity="success"
    />
  );
  expect(getAllByRole("status").length).toEqual(1);
  expect(queryAllByRole("alert").length).toEqual(0);
});

it("displays a message with role=alert when severity is set to error", async () => {
  const { getAllByRole, queryAllByRole } = render(
    <Snackbar
      open={true}
      onClose={() => null}
      notificationText="Text"
      severity="error"
    />
  );
  expect(getAllByRole("alert").length).toEqual(1);
  expect(queryAllByRole("status").length).toEqual(0);
});
