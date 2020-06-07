import { api } from "../../../store";

export const getCategories = async () =>
  await api.get<ICategory[]>("/categories");

export const updateCategories = async (data: ICategory[]) =>
  await api.post<ICategory[] | string>("/categories", { data });
