import { ReactNode } from 'react'
import { classNames } from "@/shared/utils/classnames";

interface ToastContentProps {
  icon: ReactNode
  title: string
  message: string
}

const iconClassNames = {
  primary: "text-primary bg-white",
  secondary: "text-black bg-gray-200",
  success: "text-green-500 bg-green-200",
  danger: "text-red-500 bg-red-200",
  warning: "text-yellow-500 bg-yellow-200",
  info: "text-blue-500 bg-blue-200",
};

export function ToastContent({ icon, title, message }: ToastContentProps) {
  return (
    <div
      className="flex items-center w-1/5 max-w-xs p-3 text-gray-800 bg-gray-100 rounded-md shadow-2xl"
      role="alert"
    >
      {icon ? (
        <div
          className={classNames(
            "inline-flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-md",
          )}
        >
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col">
        <div className="ms-3 text-sm font-bold">{title}</div>
        <div className="ms-3 text-sm font-normal">{message}</div>
      </div>
    </div>
  )
}
