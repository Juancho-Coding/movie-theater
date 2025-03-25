export const BASEURL = "http://localhost:9000/api/v1";
export const BASE_IO_URL = "http://localhost:9000";

export class ApiError extends Error {
  code: number;
  msg: string;

  constructor(code: number, msg: string) {
    super();
    this.code = code;
    this.msg = msg;
  }
}

export default BASEURL;
