import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Portfolio from "@/pages/portfolio"; 
import { IDataCmcTopRankApi, IGetProfileApi } from "@/src/api/api-interface";
import * as apiClient from "../../../src/api/api-client";

// Mock useRouter from next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// Mock the entire api-client module
jest.mock("../../../src/api/api-client");

// test suite
describe("Portfolio Page", () => {
  // Mock API client
  beforeEach(() => {
    (
      apiClient.getCmcTopRankApi as jest.Mock<Promise<IDataCmcTopRankApi[]>>
    ).mockResolvedValue([
      {
        id: 1,
        cmc_rank: 1,
        name: "BTC",
        quote: {
          USD: {
            price: 1203939,
          },
        },
      },
    ]),
      (
        apiClient.getProfileApi as jest.Mock<Promise<IGetProfileApi | null>>
      ).mockResolvedValue({
        username: "jessada",
        firstName: "jessada",
        lastName: "ratta",
        id: "efij393",
        coin: [
          {
            currencyId: 1,
            amount: 33,
          },
        ],
        favorCoin: [
          {
            currencyId: 3,
          },
        ],
      });
  });

  // afterEach(() => {
  //     // Reset all mocks after each test case
  //     jest.resetAllMocks();
  //     // Or clear all mocks
  //     // jest.clearAllMocks();
  //   });

  describe("Case api works", () => {
    test("fetches CmcTopRank before Profile on component mount", async () => {
      // Arrange
      render(<Portfolio />);

      // Wait for asynchronous operations to complete
      await waitFor(() => {
        // Assert
        expect(apiClient.getCmcTopRankApi).toHaveBeenCalledTimes(1);
        expect(apiClient.getProfileApi).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("reders normal elements", () => {
    test("renders Portfolio page with balance", () => {
      render(<Portfolio />);
      const balanceElement = screen.getByText(/Your balance/i);
      expect(balanceElement).toBeInTheDocument();
    });

    test("renders Portfolio page with a table", () => {
      render(<Portfolio />);
      const tableElement = screen.getByRole("grid");
      expect(tableElement).toBeInTheDocument();
    });

    test("renders 'Logout' button", () => {
      render(<Portfolio />);
      const logoutButton = screen.getByText(/logout/i);
      expect(logoutButton).toBeInTheDocument();
    });

    test("clicking 'Logout' button triggers logout function", () => {
      const { getByText } = render(<Portfolio />);
      const logoutButton = getByText(/logout/i);
      fireEvent.click(logoutButton);
      // Add assertions to check if the logout functionality is triggered
    });
  });

  describe("renders Snackbar on API failure", () => {
    // Mock API client
    //   beforeEach(() => {
    //     jest.mock("../../../src/api/api-client", () => ({
    //       ...jest.requireActual("../../../src/api/api-client"),
    //       getCmcTopRankApi: jest.fn(() => {
    //         throw new Error("API failed");
    //       }),
    //     }));
    //   });
    beforeEach(() => {
      (
        apiClient.getCmcTopRankApi as jest.Mock<Promise<IDataCmcTopRankApi[]>>
      ).mockRejectedValue(new Error("Some error message"));
    });

    test("renders Snackbar on API failure", async () => {
      render(<Portfolio />);
      // Wait for the Snackbar to appear
      await waitFor(() => {
        expect(screen.getByText(/Fail/i)).toBeInTheDocument();
      });
    });
  });
});
