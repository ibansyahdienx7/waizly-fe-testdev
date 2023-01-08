import { createContext, useState } from "react";
import axios from "./api/axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ValidUserContext = createContext({
  isLoggedIn: false,
  apiAuthCheck: (enteredEmail, enteredPassword) => {},
  localAuthCheck: () => {},
});

const MySwal = withReactContent(Swal);

export const ValidUserContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function apiAuthCheckHandler(enteredEmail, enteredPassword) {
    const url =
      "http://127.0.0.1:3199/api/auth/login";
    
    const method = 'POST';
    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const validUsers = [];
        for (const key in data) {
          const validUser = {
            id: key,
            ...data[key],
          };
          validUsers.push(validUser);
        }
        const authUser = validUsers.find(
          (user) =>
            user.email === enteredEmail && user.password === enteredPassword
        );
        if (authUser !== undefined) {
          localStorage.setItem("login-data", JSON.stringify(authUser));
          setIsLoggedIn(authUser);
          
          MySwal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Yeay!',
            html: <p>Logged in!</p>,
            showConfirmButton: false,
            timer: 2500
          });
        } else {
          MySwal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Oopss !!',
            html: <p>Authentication failed!</p>,
            showConfirmButton: false,
            timer: 2500
          });
        }
      })
      .catch((e) => {
        MySwal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Oopss !!',
          html: <p>Server Error!</p>,
          showConfirmButton: false,
          timer: 2500
        });
      });
  }

  const localAuthCheckHandler = () => {
    const localData = JSON.parse(localStorage.getItem("login-data"));
    if (localData !== null) {
      setIsLoggedIn(true);
    }
  };

  const context = {
    isLoggedIn: isLoggedIn,
    apiAuthCheck: apiAuthCheckHandler,
    localAuthCheck: localAuthCheckHandler,
  };

  return (
    <ValidUserContext.Provider value={context}>
      {props.children}
    </ValidUserContext.Provider>
  );
};

export default ValidUserContext;
