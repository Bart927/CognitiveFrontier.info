import React from 'react';
import { motion } from 'framer-motion';
import './Button.scss';

export interface ButtonProps {
  /** Содержимое кнопки */
  children: React.ReactNode;
  /** Вариант кнопки */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg';
  /** Отключена ли кнопка */
  disabled?: boolean;
  /** Показывать ли состояние загрузки */
  loading?: boolean;
  /** Иконка слева */
  leftIcon?: React.ReactNode;
  /** Иконка справа */
  rightIcon?: React.ReactNode;
  /** Кнопка на всю ширину */
  fullWidth?: boolean;
  /** Дополнительные CSS классы */
  className?: string;
  /** Обработчик клика */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Тип кнопки */
  type?: 'button' | 'submit' | 'reset';
  /** HTML атрибуты */
  [key: string]: unknown;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const buttonClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    loading && 'btn--loading',
    disabled && 'btn--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  return (
    <motion.button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg className="btn__spinner-icon" viewBox="0 0 24 24">
            <circle
              className="btn__spinner-circle"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="2"
            />
          </svg>
        </span>
      )}

      {leftIcon && !loading && (
        <span className="btn__icon btn__icon--left" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      <span className="btn__content">{children}</span>

      {rightIcon && !loading && (
        <span className="btn__icon btn__icon--right" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
};
