import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormValues>();
  const [apiError, setApiError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const navigate = useNavigate();
  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    setApiError('');
    setSuccess('');
    try {
      await axios.post('/api/auth/signup', data);
      setSuccess('Registration successful! Please check your email for confirmation.');
      reset();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sign Up</h2>
      {apiError && <div role="alert" style={{ color: 'red' }}>{apiError}</div>}
      {success && <div role="status" style={{ color: 'green' }}>{success}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span role="alert" style={{ color: 'red' }}>{errors.name.message}</span>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <span role="alert" style={{ color: 'red' }}>{errors.email.message}</span>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          {errors.password && <span role="alert" style={{ color: 'red' }}>{errors.password.message}</span>}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
