import { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearError, fetchProfileEdit } from '../../store/fetchSlice';

import classes from './EditProfile.module.scss';

type Inputs = {
  username: string;
  email: string;
  password: string;
  avatarImage: string;
};

export default function EditProfile() {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const {
    usersFetchData: { currentUser },
    loading,
    error,
  } = useAppSelector((state) => state.fetchSlice);
  const {
    register,
    handleSubmit,
    formState: { submitCount, isSubmitting, errors },
  } = useForm<Inputs>();
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (token && currentUser)
      dispatch(
        fetchProfileEdit({
          body: {
            user: {
              username: data.username,
              email: data.email,
              [data.avatarImage && 'image']: data.avatarImage,
              [data.password && 'password']: data.password,
            },
          },
          token,
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
      return (
        <span className={classes['form-edit-profile__warning']}>{errors[field]?.message}</span>
      );
    }
    if (typeof error === 'object') {
      if (error[field]) {
        return (
          <span
            className={classes['form-edit-profile__warning']}
          >{`${field} ${error[field]}`}</span>
        );
      }
    }
    return null;
  }

  function dataInputClasses(input: keyof Inputs) {
    return classNames(classes['form-edit-profile__data-input'], {
      [classes['form-edit-profile__data-input--warning']]:
        errors[input] ||
        (typeof error === 'object' && (input === 'username' || input === 'email') && error[input]),
    });
  }

  return !token ? (
    <Redirect to="/" />
  ) : (
    <div className={classes['form-wrap']}>
      <form className={classes['form-edit-profile']} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={classes['form-edit-profile__title']}>Edit Profile</h2>
        <fieldset className={classes['form-edit-profile__data-inputs']}>
          <label className={classes['form-edit-profile__data-input__lable']}>
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
          <label className={classes['form-edit-profile__data-input__lable']}>
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
          <label className={classes['form-edit-profile__data-input__lable']}>
            New Password
            <input
              className={dataInputClasses('password')}
              type="text"
              placeholder="Password"
              {...register('password', {
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
              <span className={classes['form-edit-profile__warning']}>
                {errors.password.message}
              </span>
            )}
          </label>
          <label className={classes['form-edit-profile__data-input__lable']}>
            Avatar Image (url)
            <input
              className={dataInputClasses('avatarImage')}
              type="url"
              placeholder="Avatar Image"
              {...register('avatarImage')}
            />
            {errors.avatarImage && (
              <span className={classes['form-edit-profile__warning']}>
                {errors.avatarImage.message}
              </span>
            )}
          </label>
        </fieldset>
        <button
          className={classes['form-edit-profile__submit-button']}
          type="submit"
          onClick={() => dispatch(clearError('all'))}
        >
          Save
        </button>
        {error && typeof error === 'string' && (
          <span className={classes['form-edit-profile__warning']}>{error}</span>
        )}
      </form>
    </div>
  );
}
