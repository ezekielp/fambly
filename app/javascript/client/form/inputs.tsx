import { NumberInput } from './NumberInput';
import { TextInput } from './TextInput';
import { TextArea } from './TextArea';
import { SelectInput } from './SelectInput';
import { withFormik } from './withFormik';

export const FormikTextInput = withFormik(TextInput);
export const FormikTextArea = withFormik(TextArea);
export const FormikNumberInput = withFormik(NumberInput);
export const FormikSelectInput = withFormik(SelectInput);
