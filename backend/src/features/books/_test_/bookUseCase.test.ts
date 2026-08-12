import { describe, expect, test } from "bun:test";
import { BookChapterMemoUseCase } from "../usecase/bookChapterMemoUseCase";
import { BookOutputUseCase } from "../usecase/bookOutputUseCase";
import { UserBookUseCase } from "../usecase/userBookUseCase";
import { bookOutputValidationMessages } from "../validation/messages/bookOutputMessages";
import {
    createMockBookChapterMemoRepository,
    createMockBookOutputRepository,
    createMockBookSearchAdapter,
    createMockUserBookRepository,
    defaultBookOutput,
    defaultChapterMemo,
    defaultSearchResult,
    defaultUserBook,
    defaultUserBookId,
    defaultUserId,
} from "./testHelpers";

/**
 * UserBookUseCase の振る舞いテスト
 */
describe("userBookUseCase.ts / UserBookUseCase", () => {
    // 検索処理
    test("searchBooks (正常系) provider由来の検索結果を返す", async () => {
        // 前後空白を trim したクエリでアダプタが呼ばれることを検証
        const bookSearchAdapter = createMockBookSearchAdapter();
        const useCase = new UserBookUseCase(
            createMockUserBookRepository(),
            bookSearchAdapter,
        );

        const result = await useCase.searchBooks(" ddd ");

        expect(bookSearchAdapter.searchBooks).toHaveBeenCalledWith("ddd");
        expect(result).toEqual([defaultSearchResult]);
    });

    // 新規追加処理
    test("createUserBook (正常系) APIから取得した本をユーザー本として保存する", async () => {
        // 検証通過後に repository.saveUserBook へ同じ入力が渡ることを検証
        const userBookRepository = createMockUserBookRepository();
        const useCase = new UserBookUseCase(
            userBookRepository,
            createMockBookSearchAdapter(),
        );
        const input = {
            userId: defaultUserId,
            book: defaultSearchResult,
            status: "unread" as const,
        };

        const result = await useCase.createUserBook(input);

        expect(userBookRepository.saveUserBook).toHaveBeenCalledWith(input);
        expect(result).toEqual(defaultUserBook);
    });

    // 更新処理
    test("updateUserBook (正常系) 読書状態と現在ページを更新する", async () => {
        // 検証通過後に repository.updateUserBook へ同じ入力が渡ることを検証
        const userBookRepository = createMockUserBookRepository();
        const useCase = new UserBookUseCase(
            userBookRepository,
            createMockBookSearchAdapter(),
        );
        const input = {
            userBookId: defaultUserBookId,
            status: "reading" as const,
            currentPage: 180,
        };

        const result = await useCase.updateUserBook(input);

        expect(userBookRepository.updateUserBook).toHaveBeenCalledWith(input);
        expect(result).toEqual(defaultUserBook);
    });
});

/**
 * BookChapterMemoUseCase の振る舞いテスト
 */
describe("bookChapterMemoUseCase.ts / BookChapterMemoUseCase", () => {
    // 新規追加処理
    test("createChapterMemo (正常系) 章ごとのメモを記録する", async () => {
        // タイトル・メモ付きの入力が repository に渡ることを検証
        const bookChapterMemoRepository = createMockBookChapterMemoRepository();
        const useCase = new BookChapterMemoUseCase(bookChapterMemoRepository);
        const input = {
            userBookId: defaultUserBookId,
            chapterTitle: "Chapter 1",
            chapterOrder: 1,
            memo: "Important domain concept.",
        };

        const result = await useCase.createChapterMemo(input);

        expect(bookChapterMemoRepository.createChapterMemo).toHaveBeenCalledWith(
            input,
        );
        expect(result).toEqual(defaultChapterMemo);
    });

    // 任意項目省略時の検証
    test("createChapterMemo (正常系) タイトルとメモを省略して記録できる", async () => {
        // chapterOrder のみでも作成できることを検証
        const bookChapterMemoRepository = createMockBookChapterMemoRepository();
        const useCase = new BookChapterMemoUseCase(bookChapterMemoRepository);
        const input = {
            userBookId: defaultUserBookId,
            chapterOrder: 1,
        };

        const result = await useCase.createChapterMemo(input);

        expect(bookChapterMemoRepository.createChapterMemo).toHaveBeenCalledWith(
            input,
        );
        expect(result).toEqual(defaultChapterMemo);
    });

    test("deleteChapterMemo (正常系) 章メモを削除する", async () => {
        const bookChapterMemoRepository = createMockBookChapterMemoRepository();
        const useCase = new BookChapterMemoUseCase(bookChapterMemoRepository);
        const input = { chapterMemoId: defaultChapterMemo.chapterMemoId };

        const result = await useCase.deleteChapterMemo(input);

        expect(bookChapterMemoRepository.deleteChapterMemo).toHaveBeenCalledWith(
            input.chapterMemoId,
        );
        expect(result).toEqual(defaultChapterMemo);
    });
});

/**
 * BookOutputUseCase の振る舞いテスト
 */
describe("bookOutputUseCase.ts / BookOutputUseCase", () => {
    // 新規追加処理
    test("createOutput (正常系) 本の内容を説明するアウトプットを記録する", async () => {
        // 検証通過後に repository.createOutput へ同じ入力が渡ることを検証
        const bookOutputRepository = createMockBookOutputRepository();
        const useCase = new BookOutputUseCase(bookOutputRepository);
        const input = {
            userBookId: defaultUserBookId,
            chapterTitle: "Chapter 1",
            chapterOrder: 1,
            title: "DDD explanation",
            body: "Explain aggregate boundaries in my own words.",
        };

        const result = await useCase.createOutput(input);

        expect(bookOutputRepository.createOutput).toHaveBeenCalledWith(input);
        expect(result).toEqual(defaultBookOutput);
    });

    // バリデーション失敗時の検証
    test("createOutput (異常系) 空の本文は保存しない", async () => {
        // 空の body はエラーになり、repository が呼ばれないことを検証
        const bookOutputRepository = createMockBookOutputRepository();
        const useCase = new BookOutputUseCase(bookOutputRepository);

        await expect(
            useCase.createOutput({
                userBookId: defaultUserBookId,
                chapterOrder: 1,
                title: "DDD explanation",
                body: "",
            }),
        ).rejects.toThrow(bookOutputValidationMessages.outputBodyRequired);

        expect(bookOutputRepository.createOutput).not.toHaveBeenCalled();
    });
});
