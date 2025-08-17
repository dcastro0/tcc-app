import { AuthData } from "./AuthData";

interface SignInProp {
    email: string;
    password: string;
}

interface AuthContextData {
    authData?: AuthData;
    signIn: (data: SignInProp) => Promise<void>;
    signOut: () => Promise<void>;
    loading: boolean;
}

export { AuthContextData, AuthData, SignInProp };
