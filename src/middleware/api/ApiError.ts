export default class ApiError extends Error {
  public code: number;
  public cause: string;

  constructor(message: string, code: number, cause: string) {
    super(message);
    this.code = code;
    this.cause = cause;
  }
}
