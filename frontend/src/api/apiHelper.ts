export const BASEURL = "http://localhost:9001/api/v1";

export class ApiError extends Error {
  code: number;
  status: string;

  constructor(code: number, status: string) {
    super();
    this.code = code;
    this.status = status;
  }
}

export default BASEURL;
