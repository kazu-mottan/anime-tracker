/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { DetailedHTMLFactory, HTMLAttributes, ButtonHTMLAttributes, FormHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ImgHTMLAttributes } from 'react';

declare module 'framer-motion' {
  interface HTMLMotionProps<T> extends HTMLAttributes<T> {}

  interface MotionProps {
    className?: string;
    onClick?: (...args: unknown[]) => void;
    type?: string;
    onSubmit?: (...args: unknown[]) => void;
    src?: string;
    alt?: string;
    disabled?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
    layoutId?: string;
  }
}
