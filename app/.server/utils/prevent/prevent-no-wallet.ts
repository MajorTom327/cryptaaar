import { redirect } from "react-router";
import { User } from "~/types/user";
import { AddressesDao } from "../../dao/addresses-dao";

export const preventNoWallet = async (user: User | null) => {
  if (!user) {
    return null;
  }
  const addressDao = new AddressesDao();
  const address = await addressDao.getMainAddress(user);
  if (!address) throw redirect("/addresses/add");

  return address;
};
