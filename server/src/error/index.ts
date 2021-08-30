//* 커스텀 에러: 멀터 파일
export class FileTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileTypeError";
  }
}