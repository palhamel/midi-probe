import { LuTriangleAlert } from 'react-icons/lu';

interface ErrorBannerProps {
  message: string;
}

const ErrorBanner = ({ message }: ErrorBannerProps) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-accent-red/10 border-b border-accent-red/20">
    <LuTriangleAlert className="w-4 h-4 text-accent-red shrink-0" />
    <span className="text-xs text-accent-red">{message}</span>
  </div>
);

export default ErrorBanner;
