import React, { useEffect, useRef, useState } from 'react';
import './Tooltip.css';
import type { TooltipProps } from '../../data/types';

const Tooltip: React.FC<TooltipProps> = ({
  text,
  delay = 3000,
  duration,
  position = 'up',
  children
}) => {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current || triggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;

    const showTimer = window.setTimeout(
      () => setVisible(true),
      delay
    );

    return () => clearTimeout(showTimer);
  }, [triggered, delay]);

  useEffect(() => {
    if (!visible || !duration) return;

    const hideTimer = window.setTimeout(
      () => setVisible(false),
      duration
    );

    return () => clearTimeout(hideTimer);
  }, [visible, duration]);

  return (
    <span ref={wrapperRef} className="tooltip__wrapper">
      {children}
      {visible && (
        <span className={`tooltip__content tooltip__${position}`}>
          {text}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
