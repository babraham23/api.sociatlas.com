class ResponseObject {
    constructor(data) {
        this.data = data.data || null;
        this.type = data.type || 200;
        this.message = data.message || null;
        this.error = data.type && data.type !== 200 ? true : false;
    }
}

module.exports = {
    ResponseObject
};