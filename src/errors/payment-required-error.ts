import { ApplicationError } from '@/protocols';

export function paymentRequiredError(): ApplicationError {
  return {
    name: 'paymentRequiredError',
    message: 'You must pay the ticket to continue',
  };
}
