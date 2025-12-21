/* eslint-disable formatjs/no-literal-string-in-jsx */
import { useFeatureSupport } from "@canva/app-hooks";
import { TestAppI18nProvider } from "@canva/app-i18n-kit";
import { TestAppUiProvider } from "@canva/app-ui-kit";
import { addElementAtPoint } from "@canva/design";
import type { Feature } from "@canva/platform";
import { requestOpenExternalUrl } from "@canva/platform";
import { render, waitFor } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import type { ReactNode } from "react";
import { App } from "../app";

function renderInTestProvider(node: ReactNode): RenderResult {
  return render(
    // In a test environment, you should wrap your apps in `TestAppI18nProvider` and `TestAppUiProvider`, rather than `AppI18nProvider` and `AppUiProvider`
    <TestAppI18nProvider>
      <TestAppUiProvider>{node}</TestAppUiProvider>,
    </TestAppI18nProvider>,
  );
}

jest.mock("@canva/app-hooks");

// This test demonstrates how to test code that uses functions from the Canva Apps SDK
// For more information on testing with the Canva Apps SDK, see https://www.canva.dev/docs/apps/testing/
describe("Hello World Tests", () => {
  const mockIsSupported = jest.fn();
  const mockUseFeatureSupport = jest.mocked(useFeatureSupport);
  const mockRequestOpenExternalUrl = jest.mocked(requestOpenExternalUrl);

  beforeEach(() => {
    jest.resetAllMocks();
    mockIsSupported.mockImplementation(
      (fn: Feature) => fn === addElementAtPoint,
    );
    mockUseFeatureSupport.mockReturnValue(mockIsSupported);
    mockRequestOpenExternalUrl.mockResolvedValue({ status: "completed" });
  });

  // Note: This test is disabled as it references functionality not present in the song lyrics app
  // The song lyrics app uses addPage instead of addElementAtPoint
  // it("should add a text element when the button is clicked", () => {
  //   // Test implementation for song lyrics app would go here
  // });

  // Note: This test is disabled as it references functionality not present in the song lyrics app
  // it("should call `requestOpenExternalUrl` when the button is clicked", () => {
  //   // Test implementation for song lyrics app would go here
  // });

  // this test demonstrates the use of a snapshot test
  it("should have a consistent snapshot", async () => {
    const result = renderInTestProvider(<App />);
    // Wait for async operations (loading songs) to complete
    await waitFor(() => {
      expect(result.container).toBeTruthy();
    });
    expect(result.container).toMatchSnapshot();
  });
});
