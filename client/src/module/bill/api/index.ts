import { api } from "../../../store";

export const getBill = async () => await api.get<IBill[]>("/bill");

export const updateBill = async (data: IBill[]) =>
  await api.post<IBill[] | string>("/bill", { data });
