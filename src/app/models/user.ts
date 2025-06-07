import { Account } from "./account";
import { Card } from "./card";

export interface User {
  id?: number;                                  // " ? " indica que é opcional. Importante, pois o próprio Banco de Dados é que vai criar o ID.
  name:string;
  account: Account;
  card: Card;
}
