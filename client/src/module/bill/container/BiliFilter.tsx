import React, { useMemo, useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { useBill } from "../hooks";
import { useStore } from "../../../store";
import { Types, getLocaleByType } from "../../type";
import { useCategories } from "../../category";

interface BiliFilterProps {}

export function BiliFilter(props: BiliFilterProps) {
  const { data: bill } = useBill();
  const { data: categories } = useCategories();
  const {
    bill: { filter, setFilter },
  } = useStore();

  const times = useMemo(
    () =>
      bill
        ?.map((b) => new Date(parseInt(b?.time?.toString(), 10)).getMonth())
        .reduce((pv, cv) => Object.assign(pv, { [cv]: 1 }), {}),
    [bill]
  );

  // init types
  useEffect(() => {
    if (filter?.types === undefined || filter?.types === null) {
      setFilter({
        ...filter,
        types: [Types.IN, Types.OUT],
      });
    }
  }, [filter, setFilter]);

  // init categories
  useEffect(() => {
    if (
      (filter?.categories === undefined || filter?.categories === null) &&
      categories?.length > 0
    ) {
      setFilter({
        ...filter,
        categories: categories?.map((c) => c.id),
      });
    }
  }, [categories, filter, setFilter]);

  // init times
  useEffect(() => {
    if (
      (filter?.times === undefined || filter?.times === null) &&
      Object.keys(times)?.length > 0
    ) {
      setFilter({
        ...filter,
        times: Object.keys(times),
      });
    }
  }, [times, filter, setFilter]);

  return (
    <Form>
      <FormGroup tag="fieldset">
        <Label>type</Label>
        {Object.values(Types).map((t) => (
          <FormGroup key={t} check>
            <Label check>
              <Input
                type="checkbox"
                checked={filter?.types?.includes?.(t)}
                onChange={() =>
                  setFilter({
                    ...filter,
                    types: filter?.types?.includes?.(t)
                      ? filter?.types?.filter?.((ft: number) => ft !== t)
                      : [...(filter?.types || []), t],
                  })
                }
              />
              {getLocaleByType(t)}
            </Label>
          </FormGroup>
        ))}
      </FormGroup>
      <FormGroup tag="fieldset">
        <Label>time</Label>
        {Object.keys(times).map((t) => (
          <FormGroup key={t} check>
            <Label check>
              <Input
                type="checkbox"
                checked={filter?.times?.includes?.(t)}
                onClick={() => {
                  setFilter({
                    ...filter,
                    times: filter?.times?.includes?.(t)
                      ? filter?.times?.filter?.((ft: string) => ft !== t)
                      : [...(filter?.times || []), t],
                  });
                }}
              />{" "}
              {parseInt(t, 10) + 1} 月
            </Label>
          </FormGroup>
        ))}
      </FormGroup>
      <FormGroup tag="fieldset">
        <Label>category</Label>
        {categories?.map((ct) => (
          <FormGroup key={ct.id} check>
            <Label check>
              <Input
                type="checkbox"
                checked={filter?.categories?.includes?.(ct?.id)}
                onClick={() => {
                  const cid = ct?.id;
                  setFilter({
                    ...filter,
                    categories: filter?.categories?.includes?.(cid)
                      ? filter?.categories?.filter?.((ft: string) => ft !== cid)
                      : [...(filter?.categories || []), cid],
                  });
                }}
              />{" "}
              {ct?.name}
            </Label>
          </FormGroup>
        ))}
      </FormGroup>
    </Form>
  );
}

export default BiliFilter;
