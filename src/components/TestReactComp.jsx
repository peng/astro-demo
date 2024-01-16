import React, { useState } from "react";
import { Button, Modal, message } from "antd";

export default function TestReactComp() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Modal
      </Button>
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => {
          message.success("It is ok, and will be close!");
          setTimeout(() => {
            setIsOpen(false);
          }, 3000);
        }}
      >
        <p>you can see me</p>
      </Modal>
    </div>
  );
}
