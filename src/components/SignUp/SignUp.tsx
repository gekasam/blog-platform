import { useEffect } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearError, fetchCreateUser } from '../../store/fetchSlice';

import classes from './SignUp.module.scss';

type Inputs = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  personalInfo: boolean;
};

export default function SignUp() {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const { loading, error } = useAppSelector((state) => state.fetchSlice);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { submitCount, isSubmitting, errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(
      fetchCreateUser({
        user: { username: data.username, email: data.email, password: data.password },
      })
    );
  };

  useEffect(() => {
    if (submitCount && !error && !loading && !isSubmitting && !Object.keys(errors).length) {
      history.push('/');
    }
  }, [isSubmitting, loading]);

  function renderErrors(field: 'username' | 'email') {
    if (errors[field]) {
      return <span className={classes['form-sign-up__warning']}>{errors[field]?.message}</span>;
    }
    if (typeof error === 'object') {
      if (error[field]) {
        return (
          <span className={classes['form-sign-up__warning']}>{`${field} ${error[field]}`}</span>
        );
      }
    }
    return null;
  }

  function dataInputClasses(input: keyof Inputs) {
    return classNames(classes['form-sign-up__data-input'], {
      [classes['form-sign-up__data-input--warning']]:
        errors[input] ||
        (typeof error === 'object' && (input === 'username' || input === 'email') && error[input]),
    });
  }

  return token ? (
    <Redirect to="/" />
  ) : (
    <div className={classes['form-wrap']}>
      <form className={classes['form-sign-up']} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={classes['form-sign-up__title']}>Create new account</h2>
        <fieldset className={classes['form-sign-up__data-inputs']}>
          <label className={classes['form-sign-up__data-input__lable']}>
            Username
            <input
              className={dataInputClasses('username')}
              type="text"
              placeholder="Username"
              {...register('username', {
                required: 'This field is required',
                minLength: {
                  value: 3,
                  message: 'Your username needs to be at least 3 characters.',
                },
                maxLength: {
                  value: 20,
                  message: 'Your username must be 20 characters or less.',
                },
                onChange: () => {
                  dispatch(clearError('username'));
                },
              })}
            />
            {renderErrors('username')}
          </label>
          <label className={classes['form-sign-up__data-input__lable']}>
            Email address
            <input
              className={dataInputClasses('email')}
              type="email"
              placeholder="Email address"
              {...register('email', {
                required: 'This field is required',
                onChange: () => {
                  dispatch(clearError('email'));
                },
              })}
            />
            {renderErrors('email')}
          </label>
          <label className={classes['form-sign-up__data-input__lable']}>
            Password
            <input
              className={dataInputClasses('password')}
              type="text"
              placeholder="Password"
              {...register('password', {
                required: 'This field is required',
                minLength: {
                  value: 6,
                  message: 'Your password needs to be at least 6 characters.',
                },
                maxLength: {
                  value: 40,
                  message: 'Your password must be 40 characters or less.',
                },
              })}
            />
            {errors.password && (
              <span className={classes['form-sign-up__warning']}>{errors.password.message}</span>
            )}
          </label>
          <label className={classes['form-sign-up__data-input__lable']}>
            Repeat Password
            <input
              className={dataInputClasses('repeatPassword')}
              type="text"
              placeholder="Password"
              {...register('repeatPassword', {
                required: 'This field is required',
                validate: (value: string) => watch('password') === value || 'Passwords must match',
              })}
            />
            {errors.repeatPassword && (
              <span className={classes['form-sign-up__warning']}>
                {errors.repeatPassword.message}
              </span>
            )}
          </label>
        </fieldset>
        <label className={classes['form-sign-up__checkbox-input__lable']}>
          <input
            type="checkbox"
            {...register('personalInfo', { required: 'This field is required' })}
          />{' '}
          I agree to the processing of my personal information
          {errors.personalInfo && (
            <span className={classes['form-sign-up__warning']}>{errors.personalInfo.message}</span>
          )}
        </label>
        <button
          className={classes['form-sign-up__submit-button']}
          type="submit"
          onClick={() => dispatch(clearError('all'))}
        >
          Create
        </button>
        {error && typeof error === 'string' && (
          <span className={classes['form-sign-up__warning']}>{error}</span>
        )}
        <span className={classes['form-sign-up__alternate-option']}>
          Already have an account?
          <Link
            className={classes['form-sign-up__alternate-option__link']}
            to="/sign-in"
            onClick={() => dispatch(clearError('all'))}
          >
            Sign In
          </Link>
          .
        </span>
      </form>
    </div>
  );
}
