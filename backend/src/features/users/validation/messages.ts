const userValidationMessages = {
    userIdInvalid: "ユーザーIDの形式が不正です。",
    userNameRequired: "user_name は必須です。",
    userNameMax: (max: number) => `user_name は${max}文字以内で入力してください。`,
    profileInvalid: "profile は文字列または null で指定してください。",
} as const;

export { userValidationMessages };
