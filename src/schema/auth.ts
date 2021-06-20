import { AuthChecker } from "type-graphql";
import { IContext } from "./context";

export const authChecker: AuthChecker<IContext> = ({ context }) => {
  const { uid } = context;
  return !!uid; // bang bang uid means return boolean
};
