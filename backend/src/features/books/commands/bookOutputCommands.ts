/**
 * 本のアウトプット内容を作成するための入力データ
 */
type CreateBookOutputInput = {
    userBookId: string;
    chapterTitle?: string;
    chapterOrder: number;
    title: string;
    body: string;
};

/**
 * 本のアウトプット内容を更新するための入力データ
 */
type UpdateBookOutputInput = {
    bookOutputId: string;
    chapterTitle?: string;
    chapterOrder?: number;
    title?: string;
    body?: string;
};

export type { CreateBookOutputInput, UpdateBookOutputInput };
