export const getLocaleByType = (type: number | string) => {
  switch (type) {
    case Types.OUT:
    case Types.OUT.toString():
      return "支出";
    case Types.IN:
    case Types.IN.toString():
      return "收入";
  }
};

export const Types = {
  IN: 1,
  OUT: 0,
};
