/**
 * 本の章メモを作成するための入力データ
 */
type CreateBookChapterMemoInput = {
    userBookId: string;
    chapterTitle?: string;
    chapterOrder: number;
    memo?: string;
};

/**
 * 本の章メモを更新するための入力データ
 */
type UpdateBookChapterMemoInput = {
    chapterMemoId: string;
    chapterTitle?: string;
    chapterOrder?: number;
    memo?: string;
};

export type { CreateBookChapterMemoInput, UpdateBookChapterMemoInput };
