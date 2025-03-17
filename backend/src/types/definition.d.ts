import "express";

declare module "express" {
  export interface Locals {
    email?: string;
    userId?: string;
  }

  export interface Response {
    locals: Locals;
  }
}
