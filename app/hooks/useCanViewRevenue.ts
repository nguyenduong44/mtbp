import { useUser } from "./useUser";

const ALLOWED_EMAILS = ["phuthinh1042@gmail.com"];

export function useCanViewRevenue() {
  const { user } = useUser();

  console.log(user);
  return user ? ALLOWED_EMAILS.includes(user.email ?? "") : false;
}
