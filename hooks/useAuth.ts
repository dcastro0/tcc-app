import { AuthContext } from "@/contexts/Auth";
import { useContext } from "react";

export const useAuth = () => {
    const { authData, loading, signIn, signOut } = useContext(AuthContext);

    return {
        authData,
        loading,
        signIn,
        signOut,
    };
};