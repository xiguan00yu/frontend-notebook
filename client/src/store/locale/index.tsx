import React, { useContext, createContext, useState } from "react";

interface IContext {
  bill: {
    filter: Record<string, any>;
    setFilter: (filter: Record<string, any>) => void;
  };
}

const LocaleStoreContext = createContext<IContext>({
  bill: {
    filter: {},
    setFilter: () => {},
  },
});

export const useStore = () => useContext(LocaleStoreContext);

interface IProvider {
  children: React.ReactNode;
}

export const LocaleStoreProvider = ({ children }: IProvider) => {
  const [value, setValue] = useState<IContext>({
    bill: {
      filter: {},
      setFilter: (filter) =>
        setValue((preValue) => ({
          ...preValue,
          bill: { ...preValue.bill, filter: filter },
        })),
    },
  });

  return (
    <LocaleStoreContext.Provider value={value}>
      {children}
    </LocaleStoreContext.Provider>
  );
};
