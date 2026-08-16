import { expect, type APIRequestContext, type Page } from "@playwright/test";

export const API_BASE = "http://127.0.0.1:3000";

/** Header の NavLink+HeroUI Link 二重構造を避けるため、ナビ内テキストをクリックする */
export async function openFromNav(page: Page, label: string, path: string) {
  const nav = page.getByRole("navigation", { name: "メインナビゲーション" });
  await nav.getByText(label, { exact: true }).click();
  await expect(page).toHaveURL(path);
}

export async function ensureBooksUser(
  request: APIRequestContext,
): Promise<string> {
  const listResponse = await request.get(`${API_BASE}/api/users`);
  expect(listResponse.ok()).toBeTruthy();
  const listBody = (await listResponse.json()) as {
    users: Array<{ id: string }>;
  };

  if (listBody.users[0]?.id) {
    return listBody.users[0].id;
  }

  const createResponse = await request.post(`${API_BASE}/api/users`, {
    data: { name: `e2e-${crypto.randomUUID().slice(0, 8)}` },
  });
  expect(createResponse.status()).toBe(201);
  const createBody = (await createResponse.json()) as { user: { id: string } };
  return createBody.user.id;
}

export async function seedUnreadBook(
  request: APIRequestContext,
  userId: string,
): Promise<{ userBookId: string; title: string }> {
  const searchResponse = await request.get(
    `${API_BASE}/api/books/search?q=${encodeURIComponent("Clean Code")}`,
  );
  expect(searchResponse.ok()).toBeTruthy();
  const searchBody = (await searchResponse.json()) as {
    books: Array<Record<string, unknown> & { title: string; sourceBookId: string }>;
  };
  expect(searchBody.books.length).toBeGreaterThan(0);
  const book = searchBody.books[0]!;

  const createResponse = await request.post(`${API_BASE}/api/user-books`, {
    data: {
      userId,
      book,
      status: "unread",
    },
  });
  expect(createResponse.status()).toBe(201);
  const createBody = (await createResponse.json()) as {
    userBook: { userBookId: string; book: { title: string } };
  };

  return {
    userBookId: createBody.userBook.userBookId,
    title: createBody.userBook.book.title,
  };
}

export async function deleteUserBook(
  request: APIRequestContext,
  userBookId: string,
) {
  const response = await request.delete(
    `${API_BASE}/api/user-books/${userBookId}`,
  );
  expect(response.ok()).toBeTruthy();
}
