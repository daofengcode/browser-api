export interface IJsonResult<T> {
  result: T;
  success: boolean;
  message: string;
}

export class JsonResult<T> implements IJsonResult<T> {
  result: T;
  success: boolean;
  message: string;
  constructor(success: boolean, message: string, result: T) {
    this.success = success;
    this.message = message;
    this.result = result;
  }
  static create<T>(success: boolean, message: string, content: T) {
    return new JsonResult(success, message, content);
  }
}
