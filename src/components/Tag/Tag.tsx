/* import { useRef, useState, useEffect } from 'react'; */
import classNames from 'classnames';

import { useDetectOverflow } from '../../hooks';

import classes from './Tag.module.scss';

export default function Tag({ tag }: { tag: string }) {
  const [isDivOverflowed, tagRef] = useDetectOverflow<HTMLDivElement>();

  const tagClasses = classNames({
    [classes['tag-wrap']]: true,
    [classes['tag-wrap__popup']]: isDivOverflowed,
  });

  return (
    <div className={tagClasses} data-content={tag}>
      <div className={classes.tag} ref={tagRef}>
        {tag}
      </div>
    </div>
  );
}
