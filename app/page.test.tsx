import { render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Home from "./page";
import { data } from "./dummy";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

/** Waits for the initial users `useEffect` to finish so state updates stay inside `act`. */
async function renderHome() {
  const view = render(<Home />);
  await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
  return view;
}

describe("Home (page)", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: { users: [] },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders column headers and users section title", async () => {
    await renderHome();

    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Vegetables")).toBeInTheDocument();
    expect(screen.getByText("Users by Department")).toBeInTheDocument();
  });

  it("lists all dummy items as buttons in the first column", async () => {
    await renderHome();

    const grid = screen.getByText("Apple").closest(".grid");
    expect(grid).not.toBeNull();
    const firstColumn = grid!.querySelector(".border.rounded");
    expect(firstColumn).not.toBeNull();

    for (const item of data) {
      expect(within(firstColumn as HTMLElement).getByRole("button", { name: item.name })).toBeInTheDocument();
    }
  });

  it("moves a fruit into the Fruits column when its button is clicked", async () => {
    const user = userEvent.setup();
    await renderHome();

    const grid = screen.getByText("Apple").closest(".grid");
    const columns = grid!.querySelectorAll(".border.rounded");
    const mainList = columns[0] as HTMLElement;
    const fruitsColumn = columns[1] as HTMLElement;

    await user.click(within(mainList).getByRole("button", { name: "Apple" }));

    expect(within(mainList).queryByRole("button", { name: "Apple" })).not.toBeInTheDocument();
    expect(within(fruitsColumn).getByRole("button", { name: "Apple" })).toBeInTheDocument();
  });

  it("moves a vegetable into the Vegetables column when its button is clicked", async () => {
    const user = userEvent.setup();
    await renderHome();

    const grid = screen.getByText("Apple").closest(".grid");
    const columns = grid!.querySelectorAll(".border.rounded");
    const mainList = columns[0] as HTMLElement;
    const vegetablesColumn = columns[2] as HTMLElement;

    await user.click(within(mainList).getByRole("button", { name: "Broccoli" }));

    expect(within(mainList).queryByRole("button", { name: "Broccoli" })).not.toBeInTheDocument();
    expect(within(vegetablesColumn).getByRole("button", { name: "Broccoli" })).toBeInTheDocument();
  });

  it("returns the first fruit to the main list on context menu when it is fruit turn", async () => {
    const user = userEvent.setup();
    const { container } = await renderHome();

    const grid = screen.getByText("Apple").closest(".grid");
    const columns = grid!.querySelectorAll(".border.rounded");
    const mainList = columns[0] as HTMLElement;
    const fruitsColumn = columns[1] as HTMLElement;

    await user.click(within(mainList).getByRole("button", { name: "Apple" }));
    await user.click(within(mainList).getByRole("button", { name: "Banana" }));

    expect(within(fruitsColumn).getAllByRole("button").map((b) => b.textContent)).toEqual([
      "Apple",
      "Banana",
    ]);

    const root = container.firstElementChild as HTMLElement;
    fireEvent.contextMenu(root);

    await waitFor(() => {
      expect(within(mainList).getByRole("button", { name: "Apple" })).toBeInTheDocument();
    });
    expect(within(fruitsColumn).getAllByRole("button").map((b) => b.textContent)).toEqual(["Banana"]);
  });

  it("fetches users and renders grouped departments from the API", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        users: [
          {
            id: 1,
            firstName: "Jane",
            lastName: "Doe",
            company: { department: "Engineering" },
          },
          {
            id: 2,
            firstName: "John",
            lastName: "Smith",
            company: { department: "Engineering" },
          },
          {
            id: 3,
            firstName: "Alex",
            lastName: "Ray",
            company: { department: "Sales" },
          },
        ],
      },
    });

    await renderHome();

    expect(mockedAxios.get).toHaveBeenCalledWith("https://dummyjson.com/users");

    expect(await screen.findByRole("heading", { name: "Engineering", level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sales", level: 3 })).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Alex Ray")).toBeInTheDocument();
  });
});
