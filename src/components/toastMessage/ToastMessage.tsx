import React from 'react';
import './ToastMessage.scss';
import Label from '../label/Label';
import Icon from '../icon/Icon';
import Box from '../box/Box';
import { toast, ToastOptions, ToastProps, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export enum ToastifyType {
	ERROR,
	SUCCESS,
	INFO,
	WARNING,
	CUSTOM
}

export interface ToastMessageProps {
	message: string;
	title?: string;
	type: ToastifyType;
	toastProps?: ToastProps;
}

let icons: { [key in 'error' | 'info' | 'success' | 'warning' | 'custom']: string } = {
	error: 'icon-warning',
	info: 'icon-information',
	success: 'icon-checkmark',
	warning: 'icon-warning',
	custom: 'icon-flag'
};

const ToastMessage: React.FC<ToastMessageProps> = (props) => {
	function getClasses() {
		let classes = ['rsToastMessage'];
		if (props.type === ToastifyType.SUCCESS) classes.push('success');
		else if (props.type === ToastifyType.ERROR) classes.push('error');
		else if (props.type === ToastifyType.INFO) classes.push('info');
		else if (props.type === ToastifyType.WARNING) classes.push('warning');
		else classes.push('custom');
		return classes;
	}
	function renderIcon() {
		if (props.type === ToastifyType.ERROR) return <Icon iconImg={icons.error} size={21} />;
		else if (props.type === ToastifyType.SUCCESS) return <Icon iconImg={icons.success} size={21} />;
		else if (props.type === ToastifyType.INFO) return <Icon iconImg={icons.info} size={21} />;
		else if (props.type === ToastifyType.WARNING) return <Icon iconImg={icons.warning} size={21} />;
		else return <Icon iconImg={icons.custom} size={21} />;
	}

	function getTitleFromType(): string {
		if (props.type === ToastifyType.ERROR) return 'Uh oh, something went wrong.';
		else if (props.type === ToastifyType.SUCCESS) return 'Success!';
		else if (props.type === ToastifyType.INFO) return 'Did you know?';
		else if (props.type === ToastifyType.WARNING) return 'Warning';
		return '';
	}

	return (
		<Box className={getClasses().join(' ')} display={'flex'} alignItems={'center'}>
			{renderIcon()}
			<Box marginLeft={16}>
				<Label variant={'title1'}>{props.title || getTitleFromType()}</Label>
				<Label variant={'body2'}>{props.message}</Label>
			</Box>
		</Box>
	);
};
export default ToastMessage;

export const rsToastify = {
	error: (message: string, title?: string, toastOptions?: ToastOptions) => {
		toast.error(<ToastMessage message={message} title={title} type={ToastifyType.ERROR} />, toastOptions);
	},
	info: (message: string, title?: string, toastOptions?: ToastOptions) => {
		toast.info(<ToastMessage message={message} title={title} type={ToastifyType.INFO} />, toastOptions);
	},
	success: (message: string, title?: string, toastOptions?: ToastOptions) => {
		toast.success(<ToastMessage message={message} type={ToastifyType.SUCCESS} />, toastOptions);
	},
	warning: (message: string, title?: string, toastOptions?: ToastOptions) => {
		toast.warning(<ToastMessage message={message} type={ToastifyType.WARNING} />, toastOptions);
	},
	custom: (message: string, title?: string, toastOptions?: ToastOptions) => {
		toast(<ToastMessage message={message} type={ToastifyType.CUSTOM} />, toastOptions);
	},
	setIcons: (newIcons: { [key in 'error' | 'info' | 'success' | 'warning' | 'custom']: string }) => {
		icons = newIcons;
	}
};

export { ToastContainer };
