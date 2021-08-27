"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypeError = void 0;
//* 커스텀 에러: 멀터 파일
class FileTypeError extends Error {
    constructor(message) {
        super(message);
        this.name = "FileTypeError";
    }
}
exports.FileTypeError = FileTypeError;
