// src/lib/toasts.ts
import { toast } from 'react-hot-toast'
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { ToastContent } from '@/components/ui/toast-content'

const show = (icon: React.ReactNode, title: string, message: string) => {
  toast.custom(<ToastContent icon={icon} title={title} message={message} />, {
    duration: 4000,
    position: 'top-right',
  })
}

export const toasts = {
  success: (title: string, message: string) =>
    show(<CheckCircleIcon className="w-5 h-5 text-green-500" />, title, message),
  error: (title: string, message: string) =>
    show(<XCircleIcon className="w-5 h-5 text-red-500" />, title, message),
  info: (title: string, message: string) =>
    show(<InformationCircleIcon className="w-5 h-5 text-blue-500" />, title, message),
  warning: (title: string, message: string) =>
    show(<ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />, title, message),
}
