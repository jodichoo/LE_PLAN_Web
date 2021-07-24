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
    const [username, setUsername] = useState('User'); 
    const [displayName, setDisplayName] = useState('User'); 

    //values that is passed down and used throughout all child components 
    const value = {
        currentUser,
        username,
        signup,
        login,
        logout
    }

    function signup(email, password, un, display) {
        setDisplayName(display); 
        setUsername(un);
        return auth.createUserWithEmailAndPassword(email, password)
            .then(response => {
                const user = response.user; 
                user.updateProfile({
                    displayName: display,
                    photoURL: 'https://i.stack.imgur.com/l60Hf.png'
                }).then(() => {
                    console.log('set the display name and photo url'); 
                }).catch((error) => {
                    console.log(error); 
                });
                const uid = user.uid; 
                const data = {
                    storedDate: '2021-05-31',
                    displayName: display,
                    dark: true,  
                    photoURL: 'https://i.stack.imgur.com/l60Hf.png',
                    username: un,
                    workTime: 0, 
                    lifeTime: 0,
                    friends: [],
                    bio: 'I am Groot'
                }; 
                db.collection('users').doc(uid).set(data)
                    .then(() => {console.log('set user data')})
                    .catch(error => console.log(error));

                db.collection('usernames').doc(un).set({
                    username: un,
                }).then(() => {console.log('set username')})
                    .catch(error => console.log(error));
            }) 
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