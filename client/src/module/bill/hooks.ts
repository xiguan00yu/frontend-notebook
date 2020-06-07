import { useState, useEffect, useCallback } from "react";
import * as Api from "./api";

const listeners: Function[] = [];

const registerListener = (cb: Function) => listeners.push(cb);

const updateListener = () => listeners.forEach((l) => l?.());

export const useBill = () => {
  const [bill, setBill] = useState<IBill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    // init loading
    setLoading(true);
    // get data
    try {
      const response = await Api.getBill();
      if (response.ok && response.data && Array.isArray(response.data)) {
        setBill(response.data);
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

  return {
    data: bill,
    loading,
    error,
    refetch: updateListener,
  };
};

interface UseCreateBillProps {
  onSuccess?: () => void;
  onFail?: () => void;
}

export const useCreateBill = (props: UseCreateBillProps = {}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const _createBill = useCallback(
    async (createBillItem: IBill) => {
      if (!createBillItem) return;

      // init loading
      setLoading(true);

      try {
        const getResponse = await Api.getBill();
        // eslint-disable-next-line
        if (!getResponse.ok) throw getResponse?.originalError;
        // get all data
        const bill = getResponse.data || [];
        // update bill
        const updateResponse = await Api.updateBill([...bill, createBillItem]);
        if (updateResponse.ok) {
          updateListener?.();
          props?.onSuccess?.();
        }
      } catch (error) {
        setError(error);
        props?.onFail?.();
      }
      setLoading(false);
    },
    [props]
  );

  return {
    createBill: _createBill,
    loading,
    error,
    refetch: updateListener,
  };
};
