/* dev purposes
export const BASEURL = "http://localhost:9000/api/v1";
export const BASE_IO_URL = "http://localhost:9000";
*/
export const BASEURL =
  import.meta.env.VITE_BASE_URL || window?.env?.VITE_BASE_URL || "";
export const BASE_IO_URL =
  import.meta.env.VITE_BASE_IO_URL || window?.env?.VITE_BASE_IO_URL || "";

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
