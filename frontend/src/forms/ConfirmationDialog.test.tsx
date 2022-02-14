import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, waitFor } from "@testing-library/react";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

describe("accessibility", () => {
  it(`moves focus to the first focusable element when opening the
  modal`, async () => {
    function Wrapper() {
      const [opened, setOpened] = useState(true);
      return (
        <I18nProvider i18n={i18n}>
          <ConfirmationDialog
            questionText="Do you accept?"
            onClose={() => setOpened(false)}
            onValidate={() => null}
            opened={opened}
          />
        </I18nProvider>
      );
    }
    const { getByRole } = render(<Wrapper />);
    const noButton = getByRole("button", { name: "No" });
    await waitFor(() => expect(noButton).toHaveFocus());
  });
});
