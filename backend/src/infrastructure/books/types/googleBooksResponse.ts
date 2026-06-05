type GoogleBooksResponse = {
    items?: Array<{
        id: string;
        volumeInfo?: {
            title?: string;
            authors?: string[];
            publisher?: string;
            publishedDate?: string;
            description?: string;
            pageCount?: number;
            imageLinks?: {
                thumbnail?: string;
            };
            infoLink?: string;
        };
    }>;
};

export type { GoogleBooksResponse };
