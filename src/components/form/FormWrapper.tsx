import React, { FormEvent } from 'react';

export interface FormWrapperProps extends React.PropsWithChildren {
	onSubmit?: () => void;
	className?: string;
	id?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = (props) => {
	function submitHandler(event: FormEvent) {
		event.preventDefault();
		if (props.onSubmit) props.onSubmit();
	}

	return (
		<form
			id={props.id}
			action="#"
			onSubmit={submitHandler}
			className={props.className ? `rsFormWrapper ${props.className}` : 'rsFormWrapper'}
		>
			{props.children}
		</form>
	);
};
export default FormWrapper;
