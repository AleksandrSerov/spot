import { forwardRef, PropsWithChildren } from 'react';

import styles from './index.module.css';

type Props = PropsWithChildren<{
	onClick: () => void;
}>;

// eslint-disable-next-line react/display-name
export const Button = forwardRef<HTMLButtonElement, Props>(({ children, onClick }, ref) => (
	<button className={ styles.component } onClick={ onClick } ref={ ref }>
		{children}
	</button>
));
