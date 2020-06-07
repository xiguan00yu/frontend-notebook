import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Collapse, Container } from "reactstrap";
import BiliForm from "./BiliForm";
import BiliFilter from "./BiliFilter";
import { useBill } from "../hooks";

export function BiliHeader() {
  const { refetch } = useBill();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  useEffect(() => {
    // init open Collapse
    const initAnimation_1 = setTimeout(() => {
      setIsFilterOpen(false);
      setIsCreateFormOpen(true);
    }, 1500);
    const initAnimation_2 = setTimeout(() => {
      setIsCreateFormOpen(false);
    }, 2500);
    return () => {
      clearTimeout(initAnimation_1);
      clearTimeout(initAnimation_2);
    };
  }, []);

  return (
    <Container style={{ paddingLeft: 0, paddingBottom: 8 }}>
      <Button
        active={!!isFilterOpen}
        color="primary"
        onClick={() => {
          if (isCreateFormOpen) {
            // close other form
            setIsCreateFormOpen(!isCreateFormOpen);
          }
          setIsFilterOpen(!isFilterOpen);
        }}
        style={{ marginRight: 8, marginBottom: 8 }}
      >
        过滤条件
      </Button>
      <Button
        active={!!isCreateFormOpen}
        color="primary"
        onClick={() => {
          if (isFilterOpen) {
            // close other form
            setIsFilterOpen(!isFilterOpen);
          }
          setIsCreateFormOpen(!isCreateFormOpen);
        }}
        style={{ marginRight: 8, marginBottom: 8 }}
      >
        新增
      </Button>
      <Button
        color="primary"
        onClick={refetch}
        style={{ marginRight: 8, marginBottom: 8 }}
      >
        刷新
      </Button>
      <Collapse isOpen={isCreateFormOpen}>
        <Card>
          <CardBody>
            <BiliForm onSubmitSuccess={() => setIsCreateFormOpen(false)} />
          </CardBody>
        </Card>
      </Collapse>
      <Collapse isOpen={isFilterOpen}>
        <Card>
          <CardBody>
            <BiliFilter />
          </CardBody>
        </Card>
      </Collapse>
    </Container>
  );
}
