import classes from './ProfileCreation.module.scss';

export default function ProfileCreation() {
  return (
    <div className={classes['form-wrap']}>
      <form className={classes['form-profile-creation']}>
        <h2 className={classes['form-profile-creation__title']}>Create new account</h2>
        <fieldset className={classes['form-profile-creation__data-inputs']}>
          <label className={classes['form-profile-creation__data-input__lable']}>
            Username
            <input
              className={classes['form-profile-creation__data-input']}
              type="text"
              placeholder="Username"
            />
          </label>
          <label className={classes['form-profile-creation__data-input__lable']}>
            Email address
            <input
              className={classes['form-profile-creation__data-input']}
              type="email"
              placeholder="Email address"
            />
          </label>
          <label className={classes['form-profile-creation__data-input__lable']}>
            Password
            <input
              className={classes['form-profile-creation__data-input']}
              type="text"
              placeholder="Password"
            />
          </label>
          <label className={classes['form-profile-creation__data-input__lable']}>
            Repeat Password
            <input
              className={classes['form-profile-creation__data-input']}
              type="text"
              placeholder="Password"
            />
          </label>
        </fieldset>
        <label className={classes['form-profile-creation__checkbox-input__lable']}>
          <input type="checkbox" /> I agree to the processing of my personal information
        </label>
        <button className={classes['form-profile-creation__submit-button']} type="submit">
          Create
        </button>
        <span className={classes['form-profile-creation__alternate-option']}>
          Already have an account?{' '}
          <a className={classes['form-profile-creation__alternate-option__link']} href="/">
            Sign In
          </a>
          .
        </span>
      </form>
    </div>
  );
}
