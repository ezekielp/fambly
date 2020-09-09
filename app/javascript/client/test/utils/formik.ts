import { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

export const formUtils = <FormType extends { [key: string]: any }>(
  Component: ReactWrapper,
) => {
  return {
    fill: async (data: Partial<FormType>, inputType = 'input') => {
      Object.keys(data).forEach((key) => {
        Component.find(`${inputType}[name='${key}']`).simulate('change', {
          target: { name: key, value: data[key] },
        });
      });
      await act(async () => await wait(0));
    },
    submit: async () => {
      Component.simulate('submit');
      await act(async () => await wait(0));
    },
    findInputByName: (name: string, inputType = 'input') =>
      Component.find(`${inputType}[name="${name}"]`),
  };
};

export type FormUtils = ReturnType<typeof formUtils>;
