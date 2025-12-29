import type { ButtonHTMLAttributes, ReactNode } from 'react'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text'
  children: ReactNode
}
export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'bg-[#4f6bff] text-white hover:bg-[#3d57ff] focus:ring-[#4f6bff] shadow-lg shadow-[#4f6bff]/20 cursor-pointer',
    outline:
      'border-2 border-accent text-accent hover:bg-accent/10 focus:ring-accent cursor-pointer',
    text: 'text-accent hover:bg-accent/10 focus:ring-accent cursor-pointer',
  }
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
