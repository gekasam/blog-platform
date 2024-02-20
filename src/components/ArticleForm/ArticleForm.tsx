import { useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import uniqid from 'uniqid';
import classNames from 'classnames';

import {
  clearError,
  fetchArticle,
  fetchCreateArticle,
  fetchEditArticle,
} from '../../store/fetchSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

import classes from './ArticleForm.module.scss';

type Inputs = {
  title: string;
  description: string;
  text: string;
  tags: { name: string }[];
};

export default function ArticleForm({ articleSlug = null }: { articleSlug: string | null }) {
  const history = useHistory();
  const currentEditingArticle = useAppSelector((state) => state.fetchSlice.currentArticle);
  const title = currentEditingArticle?.title || '';
  const description = currentEditingArticle?.description || '';
  const text = currentEditingArticle?.body || '';
  const token = localStorage.getItem('token');
  const { error, loading, currentArticle } = useAppSelector((state) => state.fetchSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (articleSlug) {
      dispatch(fetchArticle(articleSlug));
    }
  }, [dispatch, articleSlug]);

  const {
    register,
    handleSubmit,
    control,
    formState: { submitCount, isSubmitting, errors },
  } = useForm<Inputs>({
    defaultValues: {
      tags:
        (currentEditingArticle?.tagList && [
          ...currentEditingArticle.tagList.map((tag) => ({ name: `${tag}` })),
        ]) ||
        [],
    },
  });

  useEffect(() => {
    if (submitCount && !error && !loading && !isSubmitting && !Object.keys(errors).length) {
      history.push(`/articles/${currentArticle?.slug}`);
    }
  }, [isSubmitting, loading]);

  const { fields, append, remove } = useFieldArray({ name: 'tags', control });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (token) {
      if (articleSlug) {
        dispatch(
          fetchEditArticle({
            body: {
              article: {
                title: data.title,
                description: data.description,
                body: data.text,
                tagList: data.tags.map((tag) => tag.name),
              },
            },
            token,
            slug: articleSlug,
          })
        );
      } else {
        dispatch(
          fetchCreateArticle({
            body: {
              article: {
                title: data.title,
                description: data.description,
                body: data.text,
                tagList: data.tags.map((tag) => tag.name),
              },
            },
            token,
          })
        );
      }
    }
  };

  function dataInputClasses(input: keyof Inputs) {
    return classNames(classes['article-form__data-input'], {
      [classes['article-form__data-input--warning']]: errors[input],
    });
  }

  return !token ? (
    <Redirect to="/sign-in" />
  ) : (
    <div className={classes['form-wrap']}>
      <form className={classes['article-form']} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={classes['article-form__header']}>Create new article</h2>
        <label className={classes['article-form__data-input__label']}>
          Title
          <input
            className={dataInputClasses('title')}
            type="text"
            placeholder="Title"
            defaultValue={title}
            {...register('title', { required: 'This field is required' })}
          />
          {errors.title && (
            <span className={classes['article-form__warning']}>{errors.title.message}</span>
          )}
        </label>
        <label className={classes['article-form__data-input__label']}>
          Short description
          <input
            className={dataInputClasses('description')}
            type="text"
            placeholder="Description"
            defaultValue={description}
            {...register('description', { required: 'This field is required' })}
          />
          {errors.description && (
            <span className={classes['article-form__warning']}>{errors.description.message}</span>
          )}
        </label>
        <label className={classes['article-form__data-input__label']}>
          Text
          <textarea
            className={`${dataInputClasses('text')} ${classes['article-form__data-input--textarea']}`}
            placeholder="Text"
            rows={7}
            defaultValue={text}
            {...register('text', { required: 'This field is required' })}
          />
          {errors.text && (
            <span className={classes['article-form__warning']}>{errors.text.message}</span>
          )}
        </label>
        <section className={classes['article-form__tags-section']}>
          Tags
          <div className={classes['article-form__tags-editing-wrap']}>
            <ul className={classes['article-form__tag-list']}>
              {fields.map((tag, index) => (
                <li key={uniqid.time('tag-')} className={classes['article-form__tag-wrap']}>
                  <input
                    className={`${classes['article-form__data-input']} ${classes['article-form__data-input--tag']}`}
                    type="text"
                    placeholder="Tag"
                    {...register(`tags.${index}.name`)}
                  />
                  <button
                    className={`${classes['article-form__tag-button']} ${classes['article-form__tag-delete-button']}`}
                    type="button"
                    onClick={() => remove(index)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <button
              className={`${classes['article-form__tag-button']} ${classes['article-form__tag-add-button']}`}
              type="button"
              onClick={() => append({ name: '' })}
            >
              Add tag
            </button>
          </div>
        </section>
        <button
          className={classes['article-form__submit-button']}
          type="submit"
          onClick={() => dispatch(clearError('all'))}
        >
          Send
        </button>
      </form>
    </div>
  );
}
