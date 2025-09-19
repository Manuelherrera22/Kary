import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group button-hover-effect',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80',
				destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:hover:bg-destructive/80',
				outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-slate-700 dark:hover:bg-slate-700/50',
				secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/70',
				ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-slate-800',
				link: 'text-primary underline-offset-4 hover:underline dark:text-primary/90',
        custom: 'bg-gradient-to-r from-[#a16ae8] to-[#714cdd] text-white hover:shadow-xl shadow-lg transform hover:scale-105 transition-all duration-300', 
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8 text-base',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };