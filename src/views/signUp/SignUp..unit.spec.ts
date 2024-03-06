vi.mock('axios');
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import SignUp from './SignUp.vue';
import axios from 'axios';

beforeEach(() => vi.clearAllMocks());

const setup = async () => {
  const user = userEvent.setup();

  const result = render(SignUp);
  const usernameInput = screen.getByLabelText('Username');
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const button = screen.getByRole('button', { name: 'Sign up' });

  await user.type(usernameInput, 'username');
  await user.type(emailInput, 'email@email.com');
  await user.type(passwordInput, '123Password');
  await user.type(confirmPasswordInput, '123Password');

  return {
    ...result,
    user,
    elements: {
      button,
    },
  };
};

describe('Sign Up', () => {
  describe('when user submits form', () => {
    it('sends username, email, password to the backend', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: {} });
      const {
        user,
        elements: { button },
      } = await setup();

      await user.click(button);

      expect(axios.post).toHaveBeenCalledWith('/api/v1/users', {
        username: 'username',
        email: 'email@email.com',
        password: '123Password',
      });
    });

    describe('when there is an ongoing api call', () => {
      it('does not allow clicking the button', async () => {
        (axios.post as jest.Mock).mockResolvedValue({ data: {} });
        const {
          user,
          elements: { button },
        } = await setup();

        await user.click(button);

        expect(axios.post).toHaveBeenCalledTimes(1);
      });
    });
  });
});
