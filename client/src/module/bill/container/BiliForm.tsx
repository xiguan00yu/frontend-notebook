import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { useCreateBill } from "../hooks";
import { useCategories } from "../../category";
import { Types, getLocaleByType } from "../../type/utils";

interface BiliFormProps {
  onSubmitFail?: () => void;
  onSubmitSuccess?: () => void;
}

interface IFormField {
  type: number;
  category: string;
  amount: number;
}

export function BiliForm({ onSubmitSuccess, onSubmitFail }: BiliFormProps) {
  const [isCreateSuccess, setCreateSuccess] = useState(false);
  const { createBill, loading, error } = useCreateBill({
    onSuccess: () => {
      setCreateSuccess?.(true);
      setTimeout(() => {
        onSubmitSuccess?.();
        setCreateSuccess?.(false);
      }, 1000);
    },
    onFail: onSubmitFail,
  });
  const { data: categories } = useCategories();
  const { control, handleSubmit, reset, watch, setValue, errors } = useForm<
    IFormField
  >();
  const onSubmit = useCallback(
    (data: IFormField) => {
      createBill({ ...data, time: Date.now() });
    },
    [createBill]
  );
  useEffect(() => {
    // for get categories, set form default values
    reset?.({
      type: Types.OUT,
      category: categories?.find?.(
        (c) => c?.type?.toString() === Types.OUT?.toString()
      )?.id,
      amount: 10,
    });
  }, [categories, reset]);
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>type</Label>
        <Controller
          as={
            <Input type="select" name="type">
              {Object.values(Types).map((t) => (
                <option key={t} value={t}>
                  {getLocaleByType(t)}
                </option>
              ))}
            </Input>
          }
          name="type"
          control={control}
          onChange={([select]) => {
            const currentType = parseInt(select?.target?.value, 10);
            // set category value
            const currentCategory = categories?.find(
              (c) => c?.type?.toString() === currentType?.toString()
            )?.id;
            currentCategory && setValue("category", currentCategory);
            //  set type value
            return currentType;
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label>category</Label>
        <Controller
          rules={{
            required: true,
          }}
          as={
            <Input type="select" name="category">
              {categories
                ?.filter((c) => {
                  const currentType = watch("type");
                  return (
                    currentType !== undefined &&
                    c?.type?.toString() === currentType?.toString()
                  );
                })
                ?.map((c) => (
                  <option key={c?.id} value={c?.id}>
                    {c.name}
                  </option>
                ))}
            </Input>
          }
          name="category"
          control={control}
        />
      </FormGroup>
      <FormGroup>
        <Label>amount</Label>
        <Controller
          rules={{
            required: true,
            validate: (data) =>
              Types.IN?.toString() === watch("type")?.toString() ||
              (Types.OUT?.toString() === watch("type")?.toString() && data > 0),
          }}
          as={
            <Input
              valid={!errors?.amount}
              type="number"
              name="amount"
              placeholder="pls input amount"
            />
          }
          name="amount"
          control={control}
        />
      </FormGroup>
      {Object.values(errors).some((e) => e) &&
        Object.values(errors).map((e) => (
          <Alert color="warning">
            {e?.type === "validate" &&
              "格式错误，类型为支出，amount不应该为负数"}
          </Alert>
        ))}
      {isCreateSuccess && <Alert color="success">{"创建账单成功"}</Alert>}
      {error && <Alert color="danger">{error?.toString?.()}</Alert>}
      <Button
        color="primary"
        disabled={loading}
        onClick={handleSubmit(onSubmit)}
      >
        Create Bill
      </Button>
    </Form>
  );
}

export default BiliForm;
