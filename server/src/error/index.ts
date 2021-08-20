//* Custom error
export class FileTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileTypeError";
  }
}