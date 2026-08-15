import { screen, waitFor, within } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { describe, expect, test } from "vitest";
import Users from "../users";
import { OWNER_USER_ID } from "../../../test/booksFixtures";
import { renderWithProviders } from "../../../test/render";

function renderUsers() {
  return renderWithProviders(
    <Routes>
      <Route path="/users" element={<Users />} />
    </Routes>,
    { initialEntries: ["/users"] },
  );
}

describe("Users", () => {
  test("見出しとユーザー名が表示される", async () => {
    renderUsers();

    expect(
      screen.getByRole("heading", { name: "Users" }),
    ).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Guest Reader")).toBeInTheDocument();

    const johnRow = screen.getByText("John").closest("li");
    expect(johnRow).not.toBeNull();
    await waitFor(() => {
      expect(
        within(johnRow as HTMLElement).getByRole("link", { name: "Books 管理" }),
      ).toHaveAttribute("href", `/users/${OWNER_USER_ID}/books`);
    });

    const guestRow = screen.getByText("Guest Reader").closest("li");
    expect(guestRow).not.toBeNull();
    expect(within(guestRow as HTMLElement).getByText("閲覧のみ")).toBeInTheDocument();
    expect(
      within(guestRow as HTMLElement).queryByRole("link", { name: "Books 管理" }),
    ).toBeNull();
  });
});
