import { httpClient } from '../lib/http';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';
import { mockService } from './mock';

const USE_MOCK = false;

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    if (USE_MOCK) {
        console.log('Using Mock Login');
        return mockService.auth.login(credentials);
    }
    return httpClient.post<AuthResponse>('/auth/login', credentials);
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    if (USE_MOCK) {
        console.log('Using Mock Register');
        return mockService.auth.register(data);
    }
    return httpClient.post<AuthResponse>('/auth/register', data);
  },

  getProfile: async (): Promise<User> => {
    if (USE_MOCK) {
        return mockService.auth.getProfile();
    }
    return httpClient.get<User>('/users/me');
  },
};

