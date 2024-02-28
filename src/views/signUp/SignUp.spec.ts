vi.mock('axios');
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import SignUp from './SignUp.vue';
import axios from 'axios';

describe('Sign Up', () => {
  it('has Sign Up header', () => {
    render(SignUp);
    const header = screen.getByRole('heading', { name: 'Sign Up' });
    expect(header).toBeInTheDocument();
  });

  it('has username input', () => {
    render(SignUp);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('has email input', () => {
    render(SignUp);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('has password input', () => {
    render(SignUp);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('has password type for password input', () => {
    render(SignUp);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('has confirm password input', () => {
    render(SignUp);
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('has password type for confirm password input', () => {
    render(SignUp);
    expect(screen.getByLabelText('Confirm Password')).toHaveAttribute('type', 'password');
  });

  it('has Sign up button', () => {
    render(SignUp);

    const button = screen.getByRole('button', { name: 'Sign up' });
    expect(button).toBeInTheDocument();
  });

  it('has Sign up button is disabled', () => {
    render(SignUp);

    const button = screen.getByRole('button', { name: 'Sign up' });
    expect(button).toBeDisabled();
  });

  describe('when user set same value to password input', () => {
    it('enable submit button', async () => {
      const user = userEvent.setup();

      render(SignUp);

      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const button = screen.getByRole('button', { name: 'Sign up' });

      await user.type(passwordInput, '123');
      await user.type(confirmPasswordInput, '123');

      expect(button).toBeEnabled();
    });
  });

  describe('when user submits form', () => {
    it('sends username, email, password to the backend', async () => {
      const user = userEvent.setup();

      render(SignUp);
      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const button = screen.getByRole('button', { name: 'Sign up' });

      await user.type(usernameInput, 'username');
      await user.type(emailInput, 'email@email.com');
      await user.type(passwordInput, '123password');
      await user.type(confirmPasswordInput, '123password');

      await user.click(button);

      expect(axios.post).toHaveBeenCalledWith('api/v1/users', {
        username: 'username',
        email: 'email@email.com',
        password: '123password',
      });
    });
  });
});
