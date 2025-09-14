import { AccountInterface } from "models/account";
import { ServerInterface } from "models/server";

export interface UserState {
  flow: String | null;
  step: String | null;
  account: AccountInterface,
  server: ServerInterface
}

const state = new Map<number, UserState>()

export default state