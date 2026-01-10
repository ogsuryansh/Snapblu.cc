const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    onClick,
    disabled = false,
    className = '',
    ...props
}) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'border border-dark-border bg-transparent hover:bg-dark-hover text-gray-300',
        ghost: 'bg-transparent hover:bg-dark-hover text-gray-300',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        ${variants[variant]}
        ${sizes[size]}
        inline-flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
            {...props}
        >
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
};

export default Button;
