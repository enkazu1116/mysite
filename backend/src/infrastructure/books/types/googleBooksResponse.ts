import { z } from "zod";

/**
 * Google Books APIの書籍情報のスキーマ
 */
const googleBooksVolumeInfoSchema = z.object({
    title: z.string().optional(),
    authors: z.array(z.string()).optional(),
    publisher: z.string().optional(),
    publishedDate: z.string().optional(),
    description: z.string().optional(),
    pageCount: z.number().optional(),
    imageLinks: z
        .object({
            thumbnail: z.string().optional(),
        })
        .optional(),
    infoLink: z.string().optional(),
});

/**
 * Google Books APIの書籍情報の一覧要素のスキーマ
 */
const googleBooksItemSchema = z.object({
    id: z.string(),
    volumeInfo: googleBooksVolumeInfoSchema.optional(),
});

/**
 * Google Books APIのレスポンススキーマ
 */
const googleBooksResponseSchema = z.object({
    items: z.array(googleBooksItemSchema).optional(),
});

/**
 * 検索レスポンスの型定義
 */
type GoogleBooksResponse = z.infer<typeof googleBooksResponseSchema>;

export { googleBooksResponseSchema };
export type { GoogleBooksResponse };
