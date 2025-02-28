import "express";

declare module "express" {
  export interface Locals {
    email?: string;
  }

  export interface Response {
    locals: Locals;
  }
}
