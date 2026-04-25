import { useCallback } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const useForm = (schema, onSubmit) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setValue,
  } = useHookForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onFormSubmit = useCallback(
    async (data) => {
      try {
        await onSubmit(data);
        reset();
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [onSubmit, reset]
  );

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    isSubmitting,
    isValid,
    reset,
    watch,
    setValue,
  };
};
