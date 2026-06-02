const skillValidationMessages = {
    userIdInvalid: "ユーザーIDの形式が不正です。",
    skillIdInvalid: "スキルIDの形式が不正です。",
    techIdInvalid: "技術IDの形式が不正です。",
    techIdsRequired: "使用技術は1件以上選択してください。",
    languageRequired: "言語は必須です。",
    languageMax: (max: number) =>
        `言語は${max}文字以内で入力してください。`,
    experienceMonthsInteger: "経験月数は整数で入力してください。",
    experienceMonthsMin: "経験月数は0以上で入力してください。",
    experienceMonthsMax: (max: number) =>
        `経験月数は${max}以下で入力してください。`,
    levelInteger: "レベルは整数で入力してください。",
    levelUnsupported: "レベルの値が不正です。",
    detailRequired: "詳細は必須です。",
    detailMax: (max: number) =>
        `詳細は${max}文字以内で入力してください。`,
} as const;

export { skillValidationMessages };
