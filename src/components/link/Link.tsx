import React from 'react';
import TooltipWrapper, { TooltipProperties } from '../tooltip/tooltipWrapper/TooltipWrapper';

export interface LinkProps extends React.PropsWithChildren<unknown> {
	path: string;
	onClick?: () => void;
	id?: string;
	className?: string;
	/**
	 * The router object is used instead of window.location.assign() to navigate to the path.
	 * This is useful when using a router like react-router-dom. If the router object is not provided,
	 * the component will try to use the following functions in order to navigate to the path:
	 * @default [`window.globalFunctions.router.navigate`,`window.router.navigate`,`window.navigate`,`window.location.assign`]
	 */
	router?: unknown & { navigate: (path: string) => void };
	noPointer?: boolean;
	external?: boolean;
	target?: 'blank' | 'self';
	highlightBlue?: boolean;
	tooltipProperties?: TooltipProperties;
}

const Link: React.FC<LinkProps> = (props) => {
	const style: React.CSSProperties = {
		textDecoration: 'inherit',
		color: `${props.highlightBlue ? 'blue' : 'inherit'}`,
		cursor: 'pointer'
	};
	if (props.noPointer) delete style['cursor'];

	function handleClick(e: React.MouseEvent) {
		e.preventDefault();
		if (props.onClick) {
			props.onClick();
			return;
		}

		if (props.external && props.path) {
			if (props.target && props.target === 'blank') window.open(props.path, '_blank');
			else window.location.assign(props.path);
			return;
		}

		if (!props.path) return;
		navigateWithRouter(props.path);
	}

	function navigateWithRouter(path: string): unknown {
		if (props.router?.navigate) return props.router.navigate?.(path);

		// Check if the window object has globalFunctions.router.navigate function
		const windowGlobalFunctions = Object.getPrototypeOf(window)?.globalFunctions;
		const windowGlobalFunctionsRouter = Object.getPrototypeOf(windowGlobalFunctions)?.router;
		const windowGlobalFunctionsRouterNavigate = Object.getPrototypeOf(windowGlobalFunctionsRouter)?.navigate;
		if (!!windowGlobalFunctionsRouterNavigate) return windowGlobalFunctionsRouterNavigate(path);

		// Check if the window object has router.navigate function
		const windowRouter = Object.getPrototypeOf(window)?.router;
		const windowRouterNavigate = Object.getPrototypeOf(windowRouter)?.navigate;
		if (!!windowRouterNavigate) return windowRouterNavigate(path);

		// Check if the window object has navigate function
		const windowNavigate = Object.getPrototypeOf(window)?.navigate;
		if (!!windowNavigate) return windowNavigate(path);

		// If none of the above functions exist, use window.location.assign()
		return window.location.assign(path);
	}

	function renderSingleLink(children: React.ReactNode) {
		return (
			<a
				id={props.id}
				className={props.className ? `trLink ${props.className}` : 'trLink'}
				style={style}
				href={props.path}
				onClick={handleClick}
			>
				{children}
			</a>
		);
	}

	function renderLink() {
		if (!props.tooltipProperties) return renderSingleLink(props.children);
		if (props.tooltipProperties.wrapContents)
			return renderSingleLink(<TooltipWrapper {...props.tooltipProperties}>{props.children}</TooltipWrapper>);
		else return <TooltipWrapper {...props.tooltipProperties}>{renderSingleLink(props.children)}</TooltipWrapper>;
	}

	return renderLink();
};

export default Link;
