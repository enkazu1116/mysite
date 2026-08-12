import type { UserBook } from "../../types/book";

export function BookCover({
  userBook,
  className = "",
}: {
  userBook: UserBook;
  className?: string;
}) {
  if (userBook.book.thumbnailUrl) {
    return (
      <img
        src={userBook.book.thumbnailUrl}
        alt=""
        className={`h-full w-full min-h-0 min-w-0 rounded-sm bg-white object-cover ${className}`}
      />
    );
  }

  return (
    <span
      className={`flex h-full w-full items-end justify-center overflow-hidden rounded-sm bg-[linear-gradient(90deg,#1a2332_0_18%,#2a3a4a_18%_82%,#0f6e6a_82%)] px-0.5 pb-1.5 ${className}`}
    >
      <span className="h-5 w-0.5 rounded bg-white/70" />
    </span>
  );
}
