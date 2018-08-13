class PagedResult {
    constructor(page, pageSize) {       
        this.page = page;
        this.pageSize = pageSize;
    }

    set setcollection(collection) {
        this.collection = collection;
    }

    set setcount(count) {
        this.count = count;
    }

    set setmessage(message) {
        this.message = message;
    }
}

module.exports = PagedResult;