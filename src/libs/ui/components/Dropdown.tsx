import * as React from "react";
import { cn } from "../../utils";
import { cva, type VariantProps } from "class-variance-authority";

type BaseDropdownAttributes = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  "id" | "className" | "onClick" | "onChange"
>;

// Variants for dropdown menu styling
const dropdownVariants = cva("relative inline-block rounded-md", { 
  variants: {
    size: {
      sm: "w-32",
      md: "w-48",
      lg: "w-64",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type DropdownVariants = VariantProps<typeof dropdownVariants>;

export interface DropdownProps extends DropdownVariants, BaseDropdownAttributes {
  children: React.ReactNode; // Supports complex elements similarly to the Table component, therefore it can be used for navigation etc.
  className?: string; 
}

// Context for the base
const DropdownContext = React.createContext<{
  isOpen: boolean;
  toggle: () => void;
} | null>(null);


/*
  { size?: string } must be always present to ensure its passed as string and not potentionally undefined
*/

//Dropdown core
const DropdownBase = React.forwardRef<HTMLDivElement, DropdownProps  & { size?: string }>(
  ({ children, className, size, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const toggle = () => setIsOpen((prev) => !prev);

    return (
      <DropdownContext.Provider value={{ isOpen, toggle }}>
        <div
          ref={ref}
          {...props}
          className={cn(dropdownVariants({size}), className)}  
        >
          {children}
        </div>
      </DropdownContext.Provider>
    );
  }
);

DropdownBase.displayName = "Dropdown";

// Dropdown Trigger (Button)
export interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps & { size?: string }>(
  ({ children, className, size, ...props }, ref) => {
    const context = React.useContext(DropdownContext);

    if (!context) throw new Error("Dropdown.Trigger must be used inside Dropdown");

    return (
      <button
        ref={ref}
        onClick={context.toggle}
        className={cn(
          "px-4 py-2 bg-white text-black rounded  border-2 border-black", 
          size === "sm" && "w-32", 
          size === "md" && "w-48", 
          size === "lg" && "w-64", 
          className
        )} // Must pass size to other sub components as well
        {...props}
      >
        {children}
      </button>
    );
  }
);


DropdownTrigger.displayName = "DropdownTrigger";

// Dropdown Menu block  
export interface DropdownMenuProps extends DropdownProps {}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps  & { size?: string }>(
  ({ children, className, size, ...props }, ref)  =>  { 
    const context = React.useContext(DropdownContext);

    if (!context) throw new Error("Dropdown.Menu must be used inside Dropdown");

    return (
      context.isOpen && (
        <div
          ref={ref}
          className={cn(
            "absolute mt-2 rounded  shadow-md border-gray-200",
            dropdownVariants({ size }),
            className
          )} // Must pass size to other sub components as well
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement<DropdownItemProps>(child) && child.type === DropdownItem) {
              return React.cloneElement(child, {
                className: cn(child.props.className, dropdownVariants({ size })),
              });
            }
            return child; // Must pass size to other subcomponents as well
          })}
        </div>
      )
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

// Dropdown Item
export interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps & { size?: string }>(
  ({ children, className, onClick, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-4 py-2  cursor-pointer",
          size === "sm" && "w-32",
          size === "md" && "w-48",
          size === "lg" && "w-64",
          className
        )} // Must pass size to other sub components as well
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);


DropdownItem.displayName = "DropdownItem";

// Must be attached as sub components of the dropdown
const Dropdown = Object.assign(DropdownBase, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  Item: DropdownItem,
});

export { Dropdown };
