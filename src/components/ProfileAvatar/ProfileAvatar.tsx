import { useAppSelector } from '../../hooks';
import avatarPlaceholder from '../../assets/icons/avatarPlaceholder.svg';

import classes from './ProfileAvatar.module.scss';

export default function ProfileAvatar() {
  const { currentUser } = useAppSelector((state) => state.fetchSlice.usersFetchData);

  return (
    <img
      className={classes.avatar}
      src={currentUser && currentUser.image ? currentUser.image : avatarPlaceholder}
      alt="Profile avatar"
    />
  );
}
