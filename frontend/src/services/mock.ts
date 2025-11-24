import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

const STORAGE_KEY_USERS = 'mock_users';

const DEFAULT_MANAGER: User = {
  id: 1,
  username: 'manager',
  email: 'manager@ptit-cinema.com',
  fullName: 'Cinema Manager',
  phone: '0913451683',
  roles: ['MANAGER', 'ADMIN'],
};

// Helper simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getMockUsers = (): User[] => {
  const raw = localStorage.getItem(STORAGE_KEY_USERS);
  let users: User[] = raw ? JSON.parse(raw) : [];

  if (!users.some((u) => u.username === DEFAULT_MANAGER.username)) {
    users = [DEFAULT_MANAGER, ...users];
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }

  return users;
};

const saveMockUser = (user: User) => {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

export const mockService = {
  auth: {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
      await delay(500);
      const users = getMockUsers();
      const user = users.find(
        (u) =>
          (u.username === credentials.usernameOrEmail ||
            u.email === credentials.usernameOrEmail) &&
          (credentials.password === '123456' || true) 
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      return {
        accessToken: 'mock_access_token_' + user.id,
        refreshToken: 'mock_refresh_token_' + user.id,
        user,
      };
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
      await delay(800);
      const users = getMockUsers();
      if (users.some((u) => u.username === data.username || u.email === data.email)) {
        throw new Error('Username or Email already exists');
      }

      const newUser: User = {
        id: Date.now(),
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        roles: ['CUSTOMER'],
      };

      saveMockUser(newUser);

      return {
        accessToken: 'mock_access_token_' + newUser.id,
        refreshToken: 'mock_refresh_token_' + newUser.id,
        user: newUser,
      };
    },

    getProfile: async (): Promise<User> => {
      await delay(300);
      const users = getMockUsers();
      if (users.length > 0) return users[users.length - 1];

      throw new Error('User not found');
    },
  },
  // Placeholders for future mocks
  cinema: {},
  movie: {},
  showtime: {},
  booking: {},
};
