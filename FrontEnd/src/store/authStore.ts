import { create } from "zustand";

type LoginFormData = {
  email: string;
  password: string;
};

type RegistrationFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  mailingAddress: string;
  billingAddress: string;
  billingSameAsMailing: boolean;
  preferredPayment: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

type AuthState = {
  loginForm: LoginFormData;
  registerForm: RegistrationFormData;
  loading: boolean;
  error: string | null;
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  setLoginField: (field: keyof LoginFormData, value: string) => void;
  setRegisterField: <K extends keyof RegistrationFormData>(
    field: K,
    value: RegistrationFormData[K],
  ) => void;
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  loginSuccess: (token: string, user: User) => void;
  logout: () => void;
  resetLoginForm: () => void;
  resetRegisterForm: () => void;
};

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  loginForm: {
    email: "",
    password: "",
  },
  registerForm: {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    mailingAddress: "",
    billingAddress: "",
    billingSameAsMailing: false,
    preferredPayment: "",
  },
  loading: false,
  error: null,
  token: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()((set) => ({
  ...initialState,

  setLoginField: (field, value) =>
    set((state) => ({
      loginForm: {
        ...state.loginForm,
        [field]: value,
      },
    })),
  setRegisterField: (field, value) =>
    set((state) => ({
      registerForm: {
        ...state.registerForm,
        [field]: value,
      },
    })),

  setLoading: (value) =>
    set(() => ({
      loading: value,
    })),

  setError: (message) =>
    set(() => ({
      error: message,
    })),

  loginSuccess: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set(() => ({
      token,
      user,
      isAuthenticated: true,
      error: null,
    }));
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set(() => ({
      ...initialState,
    }));
  },

  resetLoginForm: () =>
    set((state) => ({
      ...state,
      loginForm: initialState.loginForm,
      loading: false,
      error: null,
    })),
  resetRegisterForm: () =>
    set((state) => ({
      ...state,
      registerForm: initialState.registerForm,
      loading: false,
      error: null,
    })),
}));
