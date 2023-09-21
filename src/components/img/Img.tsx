import React, { MouseEvent, useEffect, useRef } from 'react';
import './Img.scss';
import classNames from 'classnames';
import { WebUtils } from '../../utils/Utils';
import { MISSING_IMAGE_DATA, MISSING_VIDEO_DATA } from '../../utils/constants';

type GlobalCSSValues = 'inherit' | 'initial' | 'revert' | 'unset';

export interface ImgProps {
	alt: string;
	width: string | number;
	height: string | number;
	src?: string;
	srcSetSizes?: number[];
	className?: string;
	onClick?: (event: MouseEvent) => void;
	loading?: 'lazy' | 'eager';
	root?: Element | null;
	rootMargin?: string; //Can only be px or % and all "0" have to be followed by "px"
	disableImageKit?: boolean;
	onError?: () => string;
	objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' | GlobalCSSValues;
	objectPosition?: string | GlobalCSSValues;
	missingImageData?: string;
	missingVideoData?: string;
}

const Img: React.FC<ImgProps> = (props) => {
	const imgRef = useRef<HTMLImageElement>(null);

	function renderSize(size: string | number): string {
		if (typeof size === 'number') {
			return size + 'px';
		} else {
			return size;
		}
	}

	useEffect(() => {
		let imageKitPostfix = '';
		if (!props.disableImageKit) {
			imageKitPostfix = `tr=w-${props.width}`;
			if (typeof props.height === 'number') imageKitPostfix += `,h-${props.height}`;
		}
		if (props.loading === 'lazy') {
			if (!imgRef.current) return;
			imgRef.current.setAttribute(
				'data-src',
				props.src + `${checkForExistingQuery(props.src)}${imageKitPostfix}`
			);
			if (!!props.srcSetSizes) imgRef.current.setAttribute('data-srcset', buildSrcSet());
			// Check if we have already been loaded, if so load immediately
			if (imgRef.current.src) imgRef.current.src = imgRef.current.getAttribute('data-src') || '';
		} else {
			if (!imgRef.current) return;
			imgRef.current.src = props.src + `${checkForExistingQuery(props.src)}${imageKitPostfix}`;
			if (!!props.srcSetSizes) imgRef.current.srcset = buildSrcSet();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.disableImageKit, props.loading, props.srcSetSizes, props.src, props.loading, props.width, props.height]);

	/**
	 * This useEffect is how we lazy load images. This way will work across all browsers.
	 * We will keep using this until the html attr for the <img/> tag is allowed on IOS/Safari
	 */
	useEffect(() => {
		if (!!imgRef.current?.src) return;

		const image = imgRef.current;
		if (!image) return;

		const imgOptions = {
			root: props.root || null,
			rootMargin: props.rootMargin || '0px',
			threshold: 0
		};

		function preLoadImage(img: HTMLImageElement) {
			const src = img.getAttribute('data-src');
			const srcSet = img.getAttribute('data-srcset');
			if (!src) {
				img.src = props.src ?? '';
			} else if (src && srcSet) {
				img.src = src;
				img.srcset = srcSet;
			} else {
				img.src = src;
			}
		}

		const imgObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				} else {
					preLoadImage(entry.target as HTMLImageElement);
					observer.unobserve(entry.target);
				}
			});
		}, imgOptions);

		imgObserver.observe(image);
		return () => {
			imgObserver.unobserve(image);
		};
	}, [props.root, props.rootMargin, props.src]);

	function buildSrcSet(): string {
		if (!props.srcSetSizes) return '';

		let srcSetUrl = props.srcSetSizes.map((item) => {
			let imageKitPostfix = props.disableImageKit ? '' : `tr=w-${item} ${item}w`;
			return props.src + `${checkForExistingQuery(props.src)}${imageKitPostfix}`;
		});

		let imageKitPostfix = props.disableImageKit ? '' : `tr=w-${props.width} ${props.width}w`;
		srcSetUrl.unshift(props.src + `${checkForExistingQuery(props.src)}${imageKitPostfix}`);
		return srcSetUrl.join(', ');
	}

	function checkForExistingQuery(src?: string) {
		if (!src) return '';
		if (props.disableImageKit) return '';
		if (src.includes('?')) return '&';
		else return '?';
	}

	function getOptionalStyles() {
		let styles: React.CSSProperties = {};
		if (props.objectFit) styles.objectFit = props.objectFit;
		if (props.objectPosition) styles.objectPosition = props.objectPosition;
		return styles;
	}

	return (
		<img
			style={getOptionalStyles()}
			src={''}
			ref={imgRef}
			className={classNames('rsImg', props.className)}
			width={renderSize(props.width)}
			height={renderSize(props.height)}
			alt={props.alt}
			onClick={props.onClick}
			onError={() => {
				const hasVideoExtension = WebUtils.hasVideoExtension(props.src ?? '');
				let newSrc = hasVideoExtension ? MISSING_VIDEO_DATA : MISSING_IMAGE_DATA;
				if (props.onError) newSrc = props.onError();
				if (!imgRef.current) return;
				imgRef.current.src = newSrc;
			}}
		/>
	);
};

export default Img;
