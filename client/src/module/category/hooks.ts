import { useState, useEffect, useCallback } from "react";
import * as Api from "./api";

const listeners: Function[] = [];

const registerListener = (cb: Function) => listeners.push(cb);

const updateListener = () => listeners.forEach((l) => l?.());

export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    // init loading
    setLoading(true);
    // get data
    try {
      const response = await Api.getCategories();
      if (response.ok && response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setError(response?.originalError);
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    //  init
    fetchData();
    // inject
    registerListener(fetchData);
  }, [fetchData]);

  return { data: categories, loading, error, refetch: updateListener };
};
