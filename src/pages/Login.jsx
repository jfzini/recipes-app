import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { saveToLocalStorage } from '../services/storage';
import { fetchMealByName } from '../services/theMealApi';

export default function Login() {
  const history = useHistory();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [isValid, setIsValid] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUser({ ...user, [name]: value });
    console.log(fetchMealByName('pizza'));
  };

  const handleSubmit = () => {
    saveToLocalStorage('user', { email: user.email });
    history.push('/meals');
  };

  useEffect(() => {
    const { email, password } = user;
    const MIN_PASSWORD_LENGTH = 6;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const fieldsValid = emailRegex.test(email) && password.length > MIN_PASSWORD_LENGTH;
    setIsValid(fieldsValid);
  }, [user]);

  return (
    <form>
      <input
        type="email"
        name="email"
        id=""
        data-testid="email-input"
        value={ user.email }
        onChange={ handleChange }
      />
      <input
        type="password"
        name="password"
        id=""
        data-testid="password-input"
        value={ user.password }
        onChange={ handleChange }
      />
      <button
        type="button"
        data-testid="login-submit-btn"
        disabled={ !isValid }
        onClick={ handleSubmit }
      >
        Enter
      </button>
    </form>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;
