const DEFAULT_PAGE_LIMIT = 0; // kdyz je nula, Mongo vrati vsechny zaznamy
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query) {
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

    return {
        skip: (page - 1) * limit,
        limit,
    };
}

module.exports = {
    getPagination,
};