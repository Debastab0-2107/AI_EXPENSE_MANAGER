import {
    createContext,
    useContext,
    useState
} from "react";

import { api } from "../services/api";

const AuthContext = createContext();


export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem(
            "cashcompass_token"
        )
    );


    /*
     * Store JWT after successful login.
     */
    const login = (newToken) => {

        localStorage.setItem(
            "cashcompass_token",
            newToken
        );

        setToken(newToken);
    };


    /*
     * Logout:
     *
     * 1. Tell backend to invalidate this JWT.
     * 2. Remove JWT from browser.
     * 3. Update React authentication state.
     */
    const logout = async () => {

        try {

            if (token) {

                await api.post(
                    "/api/auth/logout"
                );
            }

        } catch (error) {

            console.error(
                "Backend logout error:",
                error
            );

        } finally {

            localStorage.removeItem(
                "cashcompass_token"
            );

            localStorage.removeItem(
                "cashcompass_user_email"
            );

            setToken(null);
        }
    };


    const isAuthenticated =
        !!token;


    return (

        <AuthContext.Provider
            value={{
                token,
                isAuthenticated,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(
        AuthContext
    );
}