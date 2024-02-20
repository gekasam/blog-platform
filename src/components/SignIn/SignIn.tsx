import { useEffect } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearCurrentArticle, clearError, fetchLogin } from '../../store/fetchSlice';

import classes from './SignIn.module.scss';

type Inputs = {
  email: string;
  password: string;
};

export default function SignIn() {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const { loading, error } = useAppSelector((state) => state.fetchSlice);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { submitCount, isSubmitting, errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(
      fetchLogin({
        user: { email: data.email, password: data.password },
      })
    );
  };
  dispatch(clearCurrentArticle());
  useEffect(() => {
    if (submitCount && !error && !loading && !isSubmitting && !Object.keys(errors).length) {
      history.push('/');
    }
  }, [isSubmitting, loading]);

  function dataInputClasses(input: keyof Inputs) {
    return classNames(classes['form-sign-in__data-input'], {
      [classes['form-sign-in__data-input--warning']]: errors[input],
    });
  }

  return token ? (
    <Redirect to="/" />
  ) : (
    <div className={classes['form-wrap']}>
      <form className={classes['form-sign-in']} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={classes['form-sign-in__title']}>Sign In</h2>
        <fieldset className={classes['form-sign-in__data-inputs']}>
          <label className={classes['form-sign-in__data-input__lable']}>
            Email address
            <input
              className={dataInputClasses('email')}
              type="email"
              placeholder="Email address"
              {...register('email', {
                required: 'This field is required',
                validate: {
                  positive: (value) => !/[A-Z]/.test(value) || 'Email should be in lowercase',
                },
              })}
            />
            {errors.email && (
              <span className={classes['form-sign-in__warning']}>{errors.email.message}</span>
            )}
          </label>
          <label className={classes['form-sign-in__data-input__lable']}>
            Password
            <input
              className={dataInputClasses('password')}
              type="text"
              placeholder="Password"
              {...register('password', { required: 'This field is required' })}
            />
            {errors.password && (
              <span className={classes['form-sign-in__warning']}>{errors.password.message}</span>
            )}
          </label>
        </fieldset>
        <button
          className={classes['form-sign-in__submit-button']}
          type="submit"
          onClick={() => dispatch(clearError('all'))}
        >
          Login
        </button>
        <span className={classes['form-sign-in__alternate-option']}>
          Don’t have an account?
          <Link
            className={classes['form-sign-in__alternate-option__link']}
            to="/sign-up"
            onClick={() => dispatch(clearError('all'))}
          >
            Sign Up
          </Link>
          .
        </span>
      </form>
    </div>
  );
}
