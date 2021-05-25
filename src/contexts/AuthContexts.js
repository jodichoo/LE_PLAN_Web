import React, { useContext, useEffect, useState } from 'react'; 
import { auth, db } from '../firebase'; 

//create the current context
const AuthContext = React.createContext(); 

export function useAuth() {
    return useContext(AuthContext); 
}

//i.e. <AuthProvider>{ children }</AuthProvider>
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true); 
    
    //values that is passed down and used throughout all child components 
    const value = {
        currentUser,
        signup,
        login,
        logout
    }

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password); 
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password); 
    }

    function logout() {
        return auth.signOut(); 
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false); 
        })
        return unsubscribe; 
    }, []); //[] so it only runs once when current component is rendered 

    return (
        //provides the AuthContext to children, pass down things in value to children as props
        <AuthContext.Provider value={ value }>
            {/* if not loading, render out children */}
            {!loading && children} 
        </AuthContext.Provider>
    );
}