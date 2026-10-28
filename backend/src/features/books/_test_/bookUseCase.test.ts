import { describe, expect, test } from "bun:test";
import { UserBookUseCase } from "../usecase/userBookUseCase";
import {
    createMockBookSearchAdapter,
    createMockUserBookRepository,
    defaultSearchResult,
    defaultUserBook,
    defaultUserBookId,
    defaultUserId,
} from "./testHelpers";

describe("UserBookUseCase", () => {
    test("検索結果を trim して返す", async () => {
        const adapter = createMockBookSearchAdapter();
        const useCase = new UserBookUseCase(createMockUserBookRepository(), adapter);
        await expect(useCase.searchBooks(" ddd ")).resolves.toEqual([defaultSearchResult]);
        expect(adapter.searchBooks).toHaveBeenCalledWith("ddd");
    });

    test("ユーザー本を登録する", async () => {
        const repository = createMockUserBookRepository();
        const useCase = new UserBookUseCase(repository, createMockBookSearchAdapter());
        const input = { userId: defaultUserId, book: defaultSearchResult, status: "unread" as const };
        await expect(useCase.createUserBook(input)).resolves.toEqual(defaultUserBook);
        expect(repository.saveUserBook).toHaveBeenCalledWith(input);
    });

    test("読書状態と現在ページを更新する", async () => {
        const repository = createMockUserBookRepository();
        const useCase = new UserBookUseCase(repository, createMockBookSearchAdapter());
        const input = { userBookId: defaultUserBookId, status: "reading" as const, currentPage: 180 };
        await expect(useCase.updateUserBook(input)).resolves.toEqual(defaultUserBook);
        expect(repository.updateUserBook).toHaveBeenCalledWith(input);
    });
});
