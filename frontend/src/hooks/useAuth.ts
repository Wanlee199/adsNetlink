import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useSetAtom, useAtomValue } from 'jotai';
import { userAtom, accessTokenAtom, isAuthenticatedAtom } from '../store/auth';
import { useNavigate } from '@tanstack/react-router';
import { LoginRequest, RegisterRequest } from '../types/auth';

export const useLogin = () => {
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(accessTokenAtom);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.accessToken);
    },
  });
};

export const useRegister = () => {
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(accessTokenAtom);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.accessToken);
    },
  });
};

export const useUser = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
  });
};

export const useLogout = () => {
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(accessTokenAtom);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    setUser(null);
    setToken(null);
    queryClient.clear();
    navigate({ to: '/login', search: { redirect: undefined } });
  };
};
