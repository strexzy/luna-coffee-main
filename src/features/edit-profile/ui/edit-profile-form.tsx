'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { User } from '@entities/user';
import { Button, Input, Label } from '@shared/ui';

import { profileSchema, type ProfileValues } from '../model/profile.schema';
import { useEditProfile } from '../model/use-edit-profile';

interface Props {
  user: User;
  // Колбэк после успешного сохранения — например, обновить данные на экране.
  onSaved?: (user: User) => void;
}

export const EditProfileForm = ({ user, onSaved }: Props) => {
  const { submit, isPending, error } = useEditProfile(onSaved);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, phone: user.phone ?? '' },
  });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="name">Имя</Label>
        <Input id="name" autoComplete="name" {...register('name')} />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+7 900 000-00-00"
          {...register('phone')}
        />
        {errors.phone ? (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Сохранение…' : 'Сохранить'}
      </Button>
    </form>
  );
};
