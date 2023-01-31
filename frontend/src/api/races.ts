import { useQuery, useMutation, useQueryClient } from 'react-query';
import { queryKeys } from './config';
import { Race } from '../types';
import { baseUrl } from './config';

const getRaces = async () => {
  const response = await fetch(`${baseUrl}/races`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PUBLIC_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const races: Race[] = await response.json();

  return races;
};

export const useRaces = () => useQuery(queryKeys.races, getRaces);

const createRace = async (newRace: Race) => {
  const response = await fetch(`${baseUrl}/races`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PUBLIC_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newRace),
  });
  const race: Race = await response.json();

  return race;
};

export const useCreateRace = () => {
  const queryClient = useQueryClient();

  return useMutation(createRace, {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (e) => {
      console.log(e);
    },
  });
};

const updateRace = async (updatedRace: Race) => {
  const raceId = updatedRace.id;
  const response = await fetch(`${baseUrl}/races/${raceId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.PUBLIC_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedRace),
  });
  const race: Race = await response.json();

  return race;
};

export const useUpdateRace = () => {
  const queryClient = useQueryClient();

  return useMutation(updateRace, {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (e) => {
      console.log(e);
    },
  });
};

const deleteRace = async (raceId: number | null) => {
  const response = await fetch(`${baseUrl}/races/${raceId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.PUBLIC_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  const race: Race = await response.json();

  return race;
};

export const useDeleteRace = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteRace, {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (e) => {
      console.log(e);
    },
  });
};
