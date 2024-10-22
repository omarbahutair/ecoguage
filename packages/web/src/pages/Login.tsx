import React, { useCallback, useState } from 'react';
import BackPanel from '../assets/back-panel.jpg';
import Input from '../components/Input';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, configApiClient } from '../util/apiClient';
import { accessToken } from '../keywords';
import Message, { MessageState } from '../components/Message';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState<MessageState>({
    content: '',
    type: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    const updatedErrors: typeof errors = {
      email: '',
      password: '',
    };
    // let updatedProcessError = '';
    let updatedMessage: MessageState = {
      type: null,
      content: '',
    };

    try {
      setIsLoading(true);

      const { data } = await apiClient.post('/auth/login', form);

      localStorage.setItem(accessToken, `Bearer ${data.accessToken}`);
      configApiClient();
      navigate('/');
    } catch (error: any) {
      switch (error.response?.status) {
        case 422:
          updatedErrors.email = error.response.data.validationErrors.email?.[0];
          updatedErrors.password =
            error.response.data.validationErrors.password?.[0];
          break;
        default:
          updatedMessage = {
            type: 'error',
            content: error.response?.data?.message ?? error.message,
          };
          break;
      }
    } finally {
      setIsLoading(false);
      setErrors(updatedErrors);
      setMessage(updatedMessage);
    }
  }, [form]);

  return (
    <div
      style={{
        backgroundImage: `url(${BackPanel})`,
      }}
      className="h-screen bg-no-repeat bg-cover flex items-center justify-center"
    >
      <form
        className="flex flex-col gap-10 w-full max-w-md bg-white bg-opacity-50 backdrop-blur-md px-5 py-8 rounded-xl"
        onSubmit={(e) => {
          e.preventDefault();

          onSubmit();
        }}
      >
        <header className="flex justify-center w-full">
          <h1 className="text-2xl text-primary font-bold">Login</h1>
        </header>
        <main className="flex flex-col gap-3">
          <Message message={message} />
          <Input
            value={form.email}
            setValue={(email) => {
              setForm((prev) => ({
                ...prev,
                email,
              }));
            }}
            label="Email"
            placeholder="Email"
            error={errors.email}
          />
          <Input
            value={form.password}
            setValue={(password) => {
              setForm((prev) => ({
                ...prev,
                password,
              }));
            }}
            label="Password"
            placeholder="Password"
            type="password"
            error={errors.password}
          />
        </main>
        <footer className="flex flex-col items-center gap-3">
          <p className="text-neutral-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </p>
          <Button size="medium" type="primary" isLoading={isLoading}>
            Login
          </Button>
        </footer>
      </form>
    </div>
  );
}
