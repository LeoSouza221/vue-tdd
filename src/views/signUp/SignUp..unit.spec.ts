vi.mock('axios');
import { render, screen, waitFor } from '@testing-library/vue';
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

    describe('when success response is received', () => {
      beforeEach(() => {
        (axios.post as jest.Mock).mockResolvedValue({ data: { message: 'User create success' } });
      });
      it('displays message received from backend', async () => {
        const {
          user,
          elements: { button },
        } = await setup();

        await user.click(button);

        const text = screen.getByText('User create success');

        expect(text).toBeInTheDocument();
      });

      it('hides sign up form', async () => {
        const {
          user,
          elements: { button },
        } = await setup();

        const form = screen.getByTestId('form-sign-up');

        await user.click(button);

        await waitFor(() => {
          expect(form).not.toBeInTheDocument();
        });
      });
    });

    describe('when network failure occurs', () => {
      beforeEach(() => {
        (axios.post as jest.Mock).mockRejectedValue({});
      });
      it('displays generic message', async () => {
        const {
          user,
          elements: { button },
        } = await setup();

        await user.click(button);

        const text = await screen.getByText('Unexpected error occurred, please try again');

        await waitFor(() => {
          expect(text).toBeInTheDocument();
        });
      });

      it('hides spinner', async () => {
        const {
          user,
          elements: { button },
        } = await setup();

        await user.click(button);

        await waitFor(() => {
          expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
      });

      describe('when user submits again', () => {
        it.only('hides error when api request is progress', async () => {
          (axios.post as jest.Mock).mockRejectedValueOnce({}).mockResolvedValue({ data: {} });
          const {
            user,
            elements: { button },
          } = await setup();
          await user.click(button);
          const text = await screen.findByText('Unexpected error occurred, please try again');
          await user.click(button);

          await waitFor(() => {
            expect(text).not.toBeInTheDocument();
          });
        });
      });
    });
  });
});
