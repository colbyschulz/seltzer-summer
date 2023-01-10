import { useQuery, useMutation, useQueryClient } from 'react-query';
import { queryKeys } from './config';
import { User } from '../types';
import { baseUrl } from './config';

const getUsers = async () => {
  const response = await fetch(`${baseUrl}/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PUBLIC_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const users: User[] = await response.json();

  return users;
};

export const useUsers = () => useQuery(queryKeys.users, getUsers);

const getUser = async (userId?: string) => {
  const response = await fetch(`${baseUrl}/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PUBLIC_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const user: User = await response.json();

  return user;
};

export const useUser = (userId?: string) => useQuery([queryKeys.users, userId], () => getUser(userId));

const createUser = async (newUser: User) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PUBLIC_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });
  const race: User = await response.json();

  return race;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.users);
    },
    onError: (e) => {
      console.log(e);
    },
  });
};
