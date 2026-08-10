import { describe, expect, test } from "bun:test";
import {
    validateCreateUserInput,
    validateUpdateUserInput,
} from "../validation/userValidation";
import { validCreateUserInput, validUpdateUserInput } from "./fixtures";

const MAX_NAME_LENGTH = 30;
const MAX_BIO_LENGTH = 200;

/**
 * 入力バリデーションの振る舞いテスト
 */
describe("userValidation.ts / 入力バリデーション", () => {
    
    // User作成時の入力検証テスト
    describe("validateCreateUserInput", () => {
        // 正規入力
        test("有効な入力の場合: 空配列", () => {
            expect(validateCreateUserInput(validCreateUserInput)).toEqual([]);
        });

        // 名前のみ入力
        test("名前のみの入力の場合: 空配列", () => {
            expect(validateCreateUserInput({ name: "ユーザー" })).toEqual([]);
        });

        // 任意項目が `null`
        test("任意項目が `null` の場合: 空配列", () => {
            expect(
                validateCreateUserInput({
                    name: "ユーザー",
                    bio: null,
                    iconUrl: null,
                    githubUrl: null,
                    articleUrl: null,
                }),
            ).toEqual([]);
        });

        // エラーケース
        test.each([
            [
                "名前が未入力の場合",
                { ...validCreateUserInput, name: "" },
                "名前は必須です。",
            ],
            [
                "名前が空白文字のみの場合",
                { ...validCreateUserInput, name: "   " },
                "名前は必須です。",
            ],
            [
                "名前の入力桁数が上限以上の場合",
                {
                    ...validCreateUserInput,
                    name: "a".repeat(MAX_NAME_LENGTH + 1),
                },
                "名前は30文字以内で入力してください。",
            ],
            [
                "自己紹介文の入力桁数が上限以上の場合",
                {
                    ...validCreateUserInput,
                    bio: "a".repeat(MAX_BIO_LENGTH + 1),
                },
                "自己紹介文は200文字以内で入力してください。",
            ],
        ] as const)("%s の場合: %s", (_label, input, expectedMessage) => {
            const errors = validateCreateUserInput(input);

            expect(errors).toContain(expectedMessage);
        });
    });

    // User更新時の入力検証テスト
    describe("validateUpdateUserInput", () => {
        // 正規入力
        test("有効な入力の場合: 空配列", () => {
            expect(validateUpdateUserInput(validUpdateUserInput)).toEqual([]);
        });

        // 自己紹介文を `null` に更新する入力
        test("自己紹介文を `null` に更新する入力の場合: 空配列", () => {
            expect(validateUpdateUserInput({ bio: null })).toEqual([]);
        });

        // エラーケース
        test.each([
            [
                "更新対象が未入力の場合",
                {},
                "更新する対象情報がありません。",
            ],
            [
                "名前が未入力の場合",
                { name: "" },
                "名前は必須です。",
            ],
            [
                "名前が空白文字のみの場合",
                { name: "   " },
                "名前は必須です。",
            ],
            [
                "名前の入力桁数が上限以上の場合",
                { name: "a".repeat(MAX_NAME_LENGTH + 1) },
                "名前は30文字以内で入力してください。",
            ],
            [
                "自己紹介文の入力桁数が上限以上の場合",
                { bio: "a".repeat(MAX_BIO_LENGTH + 1) },
                "自己紹介文は200文字以内で入力してください。",
            ],
        ] as const)("%s の場合: %s", (_label, input, expectedMessage) => {
            const errors = validateUpdateUserInput(input);

            expect(errors).toContain(expectedMessage);
        });
    });
});
