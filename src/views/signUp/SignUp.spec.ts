import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import SignUp from './SignUp.vue';
// import axios from 'axios';
import { setupServer } from 'msw/node';
import { HttpResponse, delay, http } from 'msw';
import { afterAll, beforeAll } from 'vitest';

interface UserForm {
  username: string;
  email: string;
  password: string;
}

let requestBody: UserForm;
let counter = 0;
const server = setupServer(
  http.post('/api/v1/users', async ({ request }) => {
    requestBody = (await request.json()) as UserForm;
    counter += 1;
    return HttpResponse.json({ message: 'User create with success' });
  }),
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

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

  it('has Sign up spinner is disabled', () => {
    render(SignUp);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('has Sign up alert is disabled', () => {
    render(SignUp);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
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
      const {
        user,
        elements: { button },
      } = await setup();
      await user.click(button);

      await waitFor(() => {
        expect(requestBody).toEqual({
          username: 'username',
          email: 'email@email.com',
          password: '123Password',
        });
      });
    });

    describe('when there is an ongoing api call', () => {
      it('does not allow clicking the button', async () => {
        const {
          user,
          elements: { button },
        } = await setup();
        await user.click(button);
        await user.click(button);

        await waitFor(() => {
          expect(counter).toBe(1);
        });
      });

      it('displays spinner', async () => {
        server.use(
          http.post('/api/v1/users', async () => {
            await delay('infinite');
            return HttpResponse.json({});
          }),
        );
        const {
          user,
          elements: { button },
        } = await setup();
        await user.click(button);
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      it('displays alert', async () => {
        const {
          user,
          elements: { button },
        } = await setup();

        await user.click(button);

        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      describe('when success response is received', () => {
        it('display success message', async () => {
          const {
            user,
            elements: { button },
          } = await setup();

          await user.click(button);

          const text = await screen.findByText('User create with success');

          expect(text).toBeInTheDocument();
        });

        it('hide form', async () => {
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

      describe('when network failure occur', () => {
        it('displays generic message', async () => {
          server.use(
            http.post('/api/v1/users', async () => {
              return HttpResponse.error();
            }),
          );

          const {
            user,
            elements: { button },
          } = await setup();

          await user.click(button);

          const text = await screen.findByText('Unexpected error occurred, please try again');
          expect(text).toBeInTheDocument();
        });

        it('hides spinner', async () => {
          server.use(
            http.post('/api/v1/users', async () => {
              return HttpResponse.error();
            }),
          );
          const {
            user,
            elements: { button },
          } = await setup();

          await user.click(button);

          await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
          });
        });

        describe('when user submit again', () => {
          it('hides error when api request is progress', async () => {
            let processedFirstRequest = false;
            server.use(
              http.post('/api/v1/users', () => {
                if (!processedFirstRequest) {
                  processedFirstRequest = true;
                  return HttpResponse.error();
                } else {
                  return HttpResponse.json({});
                }
              }),
            );

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
});
