"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypeError = void 0;
//* Custom error
class FileTypeError extends Error {
    constructor(message) {
        super(message);
        this.name = "FileTypeError";
    }
}
exports.FileTypeError = FileTypeError;
//# sourceMappingURL=index.js.map