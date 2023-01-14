import { Modal, Button, Checkbox, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { FC, useCallback, useState } from 'react';

interface TokenFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddSuccess: () => void;
}

const TokenForm: FC<TokenFormProps> = ({ open, setOpen, onAddSuccess }) => {
  const [form] = useForm();
  const onFinish = useCallback(
    (values: Token) => {
      const tokens: Token[] = window.electron.store.get('tokens') || [];
      if (tokens.find((token) => token.hash === values.hash)) {
        message.error('token has been exist, please check it');
        return;
      }
      window.electron.store.set('tokens', [...tokens, { ...values }]);
      message.success('Add token success');
      form.resetFields();
      onAddSuccess();
      setOpen(false);
    },
    [setOpen, form]
  );

  const onFinishFailed = useCallback((errorInfo: any) => {}, []);

  const onCancel = useCallback(() => {
    form.resetFields();
    setOpen(false);
  }, [setOpen, form]);

  return (
    <Modal
      open={open}
      onOk={form.submit}
      onCancel={onCancel}
      okText={'submit'}
      title={'Add a token'}
    >
      <Form
        name="token"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="token"
          name="hash"
          rules={[{ required: true, message: 'Please input your token!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="comment"
          name="comment"
          rules={[{ required: true, message: 'Please input your comment!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default TokenForm;
