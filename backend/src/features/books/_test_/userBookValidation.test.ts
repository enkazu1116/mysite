import { describe, expect, test } from "bun:test";
import {
    validateSearchBooksQuery,
    validateUserBookId,
} from "../validation/validators/userBookValidation";

describe("userBookValidation security checks", () => {
    test("検索語の制御文字を拒否する", () => {
        expect(validateSearchBooksQuery("safe\u0000query")).not.toEqual([]);
    });

    test("検索語の長さを制限する", () => {
        expect(validateSearchBooksQuery("x".repeat(201))).not.toEqual([]);
    });

    test("ユーザー本 ID は UUID のみ許可する", () => {
        expect(validateUserBookId("not-an-id")).not.toEqual([]);
    });
});
