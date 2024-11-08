import React, { useCallback, useState } from 'react';
import BackPanel from '../assets/back-panel.jpg';
import Input from '../components/Input';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../util/apiClient';
import Message, { MessageState } from '../components/Message';
import Button from '../components/Button';
import { store } from '../store';
import { refreshAuth } from '../store/auth-slice';
import Logo from '../components/Logo';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
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
      firstName: '',
      lastName: '',
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

      if (form.confirmPassword !== form.password) {
        throw new Error('Passwords must match');
      }

      const { data } = await apiClient.post('/auth/register', form);

      store.dispatch(
        refreshAuth({ accessToken: `Bearer ${data.accessToken}` }),
      );
      navigate('/dashboard');
    } catch (error: any) {
      switch (error.response?.status) {
        case 422:
          updatedErrors.firstName =
            error.response.data.validationErrors.firstName?.[0];
          updatedErrors.lastName =
            error.response.data.validationErrors.lastName?.[0];
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
      className="h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center overflow-hidden"
    >
      <div className="overflow-auto h-full w-full flex justify-center">
        <form
          className="flex flex-col gap-10 w-full h-fit max-w-md bg-white bg-opacity-50 backdrop-blur-md px-5 py-8 rounded-xl m-2 shadow"
          onSubmit={(e) => {
            e.preventDefault();

            onSubmit();
          }}
        >
          <Logo className="w-24 m-auto" />
          <header className="flex justify-center w-full">
            <h1 className="text-2xl text-primary font-bold">Register</h1>
          </header>
          <main className="flex flex-col gap-3">
            <Message message={message} />
            <div className="flex gap-3">
              <Input
                value={form.firstName}
                setValue={(firstName) => {
                  setForm((prev) => ({
                    ...prev,
                    firstName,
                  }));
                }}
                label="First Name"
                placeholder="First Name"
                error={errors.firstName}
              />
              <Input
                value={form.lastName}
                setValue={(lastName) => {
                  setForm((prev) => ({
                    ...prev,
                    lastName,
                  }));
                }}
                label="Last Name"
                placeholder="Last Name"
                error={errors.lastName}
              />
            </div>
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
            <Input
              value={form.confirmPassword}
              setValue={(confirmPassword) => {
                setForm((prev) => ({
                  ...prev,
                  confirmPassword,
                }));
              }}
              label="Confirm Password"
              placeholder="Confirm Password"
              type="password"
            />
          </main>
          <footer className="flex flex-col items-center gap-3">
            <p className="text-neutral-400 text-sm">
              Already have an account?{' '}
              <Link tabIndex={-1} to="/login" className="hover:underline">
                Login
              </Link>
            </p>
            <Button size="medium" type="primary" isLoading={isLoading}>
              Register
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
