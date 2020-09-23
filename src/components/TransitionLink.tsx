import React from "react";
import TransitionLink from "gatsby-plugin-transition-link";

export const TRANSITION_TIME = 0.2;

export default (({ children, to, tabIndex, className }) => (
  <TransitionLink
    tabIndex={tabIndex}
    className={className}
    exit={{ delay: 0, length: TRANSITION_TIME }}
    entry={{ delay: TRANSITION_TIME / 2, length: TRANSITION_TIME }}
    onMouseDown={e => e.preventDefault()}
    to={to}
  >
    {children}
  </TransitionLink>
)) as React.FC<{ to: string; tabIndex?: number; className?: string }>;
