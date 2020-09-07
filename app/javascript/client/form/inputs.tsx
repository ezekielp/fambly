import { NumberInput } from './NumberInput';
import { TextInput } from './TextInput';
import { TextArea } from './TextArea';
import { SelectInput } from './SelectInput';
import { RadioGroup } from './RadioGroup';
import { CheckboxGroup } from './CheckboxGroup';
import { withFormik } from './withFormik';

export const FormikTextInput = withFormik(TextInput);
export const FormikTextArea = withFormik(TextArea);
export const FormikNumberInput = withFormik(NumberInput);
export const FormikSelectInput = withFormik(SelectInput);
export const FormikRadioGroup = withFormik(RadioGroup);
export const FormikCheckboxGroup = withFormik(CheckboxGroup);
