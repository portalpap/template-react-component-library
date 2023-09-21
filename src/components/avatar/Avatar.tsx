import React, { useEffect, useState } from 'react';
import './Avatar.scss';
import { DEFAULT_AVATAR_BLACK_CDN_URL } from '../../utils/constants';

export interface AvatarProps {
	widthHeight: number;
	image?: string;
	name?: string;
	color?: string;
	backgroundColor?: string;
	boxShadow?: boolean;
	onClick?: () => void;
	className?: string;
}

const Avatar: React.FC<AvatarProps> = (props) => {
	const [avatarImage, setAvatarImage] = useState<string | undefined>(props.image);

	useEffect(() => {
		setAvatarImage(props.image);
	}, [props.image]);

	function renderStyles() {
		let styles: any = {};
		styles['height'] = `${props.widthHeight}px`;
		styles['width'] = `${props.widthHeight}px`;
		styles['fontSize'] = `calc(${props.widthHeight}px * .50)`;
		styles['color'] = props.color;

		if (props.backgroundColor) styles['backgroundColor'] = props.backgroundColor;
		if (props.boxShadow)
			styles['boxShadow'] =
				'0 1px 3px 0px rgba(0,0,0, 0.2), 0 2px 1px -1px rgba(0,0,0, 0.12), 0 1px 1px 0 rgba(0,0,0,0.14)';
		return styles;
	}

	function renderClasses() {
		let classes = 'rsAvatar ';
		if (props.className) classes += props.className;
		return classes;
	}

	function formatName() {
		if (!props.name) return '';
		let name = props.name.split(' ');
		let filteredName = name.filter((item) => {
			return item.length > 0;
		});
		if (filteredName.length > 1) {
			return filteredName[0][0].toLowerCase() + filteredName[1][0].toUpperCase();
		} else if (filteredName.length === 1) {
			return filteredName[0][0].toLowerCase();
		} else {
			return '';
		}
	}
	function imageToUndefined() {
		if (props.name) {
			setAvatarImage(undefined);
		} else {
			setAvatarImage(DEFAULT_AVATAR_BLACK_CDN_URL);
		}
	}

	return (
		<div className={renderClasses()} style={renderStyles()} onClick={props.onClick}>
			{!!avatarImage && (
				<img
					src={avatarImage}
					onError={() => {
						imageToUndefined();
					}}
					alt={''}
				/>
			)}
			{!avatarImage && props.name && <div className={'nameInitial'}>{formatName()}</div>}
		</div>
	);
};

export default Avatar;
