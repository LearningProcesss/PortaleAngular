class PagedResult {
    constructor(page, pageSize) {       
        this.page = page;
        this.pageSize = pageSize;
    }

    /**
     * collection any[]
     */
    set setcollection(collection) {
        this.collection = collection
        this.count = this.collection.length
    }

    set setcount(count) {
        this.count = count;
    }

    set setmessage(message) {
        this.message = message;
    }
}

module.exports = PagedResult;