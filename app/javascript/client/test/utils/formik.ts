import { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

export const formUtils = <FormType extends { [key: string]: any }>(
  Component: ReactWrapper,
) => {
  return {
    fill: async (data: Partial<FormType>) => {
      Object.keys(data).forEach((key) => {
        Component.find(`input[name='${key}']`).simulate('change', {
          target: { name: key, value: data[key] },
        });
      });
      await act(async () => await wait(0));
    },
    submit: async () => {
      Component.simulate('submit');
      await act(async () => await wait(0));
    },
    findInputByName: (name: string) => Component.find(`input[name="${name}"]`),
    findSelectByName: (name: string) =>
      Component.find(`select[name="${name}"]`),
    findTextareaByName: (name: string) =>
      Component.find(`textarea[name="${name}"]`),
  };
};

export type FormUtils = ReturnType<typeof formUtils>;
