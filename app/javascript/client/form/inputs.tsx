import { TextInput } from './TextInput';
import { TextArea } from './TextArea';
import { withFormik } from './withFormik';

export const FormikTextInput = withFormik(TextInput);
export const FormikTextArea = withFormik(TextArea);
