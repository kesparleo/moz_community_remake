import styles from '../styles/Tooltip.module.css';
import type { TooltipProps } from '../data/types';
import { useTooltipTrigger } from '../hooks/useTooltipTrigger';

const Tooltip: React.FC<TooltipProps> = ({
  text,
  delay = 3000,
  duration,
  position = 'up',
  children
}) => {
  const { ref, visible } = useTooltipTrigger(delay, duration);

  return (
    <span ref={ref} className={styles.tooltip__wrapper}>
      {children}
      {visible && (
        <span className={`${styles.tooltip__content} ${styles[`tooltip__${position}`]}`}>
          {text}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
