const bookValidationMessages = {
    queryRequired: "query is required",
    userIdInvalid: "userId must be a valid UUID",
    userBookIdInvalid: "userBookId must be a valid UUID",
    sourceUnsupported: "source is unsupported",
    sourceBookIdRequired: "sourceBookId is required",
    titleRequired: "title is required",
    authorsInvalid: "authors must be an array of strings",
    publisherInvalid: "publisher must be a string or null",
    publishedDateInvalid: "publishedDate must be a string or null",
    descriptionInvalid: "description must be a string or null",
    pageCountInvalid: "pageCount must be a non-negative integer or null",
    thumbnailUrlInvalid: "thumbnailUrl must be a string or null",
    infoLinkInvalid: "infoLink must be a string or null",
    statusInvalid: "status is invalid",
    currentPageInvalid: "currentPage must be a non-negative integer or null",
    noteInvalid: "note must be a string or null",
    startedAtInvalid: "startedAt must be a valid date or null",
    finishedAtInvalid: "finishedAt must be a valid date or null",
};

export { bookValidationMessages };
