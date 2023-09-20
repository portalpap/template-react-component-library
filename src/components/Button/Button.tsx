import React, { CSSProperties, MouseEvent } from "react";
import "./Button.scss";

export interface ButtonProps extends React.PropsWithChildren {
  children: React.ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  small?: boolean;
  className?: string;
  disabled?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  look:
    | "containedPrimary"
    | "containedSecondary"
    | "containedTertiary"
    | "textPrimary"
    | "textSecondary"
    | "textTertiary"
    | "outlinedPrimary"
    | "outlinedSecondary"
    | "outlinedTertiary"
    | "none";
  id?: string;
  backgroundColor?: string;
  type?: "button" | "submit";
  disableRipple?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  function rippleEffect(event: MouseEvent<HTMLElement>) {
    const targetBoundingRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - targetBoundingRect.x;
    const y = event.clientY - targetBoundingRect.y;
    const ripples = document.createElement("span");
    ripples.style.left = `${x}px`;
    ripples.style.top = `${y}px`;
    ripples.classList.add("ripple");
    event.currentTarget.appendChild(ripples);
    setTimeout(() => ripples.remove(), 600);
  }

  function getStyles() {
    const styles: CSSProperties = {};
    if (props.backgroundColor && props.look === "none")
      styles["backgroundColor"] = props.backgroundColor;

    return styles;
  }

  function getClasses() {
    let classes = "trButton";

    if (props.look === "containedPrimary") classes += " contained primary";
    else if (props.look === "containedSecondary")
      classes += " contained secondary";
    else if (props.look === "containedTertiary")
      classes += " contained tertiary";
    else if (props.look === "textPrimary") classes += " text primary";
    else if (props.look === "textSecondary") classes += " text secondary";
    else if (props.look === "textTertiary") classes += " text tertiary";
    else if (props.look === "outlinedPrimary") classes += " outlined primary";
    else if (props.look === "outlinedSecondary")
      classes += " outlined secondary";
    else if (props.look === "outlinedTertiary") classes += " outlined tertiary";
    else if (props.look === "none") classes += " none";
    if (props.className) classes += ` ${props.className}`;
    if (props.small) classes += ` small`;

    return classes;
  }

  return (
    <button
      id={props.id}
      type={props.type || "button"}
      className={getClasses()}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (!props.disableRipple) rippleEffect(event);
        if (props.onClick) props.onClick(event);
      }}
      ref={props.buttonRef}
      disabled={props.disabled}
      style={getStyles()}
    >
      {props.children}
    </button>
  );
};

export default Button;
