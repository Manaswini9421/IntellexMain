import React from 'react';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoEvent } from '../actions';

interface DangerAlertProps {
  event: VideoEvent;
  onResolve: () => void;
}

export const DangerAlert: React.FC<DangerAlertProps> = ({
  event,
  onResolve,
}) => {
  const isDangerous = event.isDangerous;

  // Enhanced styling with better glow effects
  const cardClasses = isDangerous
    ? 'bg-red-950/90 border-2 border-red-600 shadow-lg shadow-red-600/50'
    : 'bg-green-950/90 border-2 border-green-600 shadow-lg shadow-green-600/30';

  const glowAnimation = isDangerous ? 'animate-pulse' : '';

  const Icon = isDangerous ? AlertTriangleIcon : CheckCircleIcon;
  const iconColor = isDangerous ? 'text-red-400' : 'text-green-400';
  const textColor = isDangerous ? 'text-red-100' : 'text-green-100';
  const timestampColor = isDangerous ? 'text-red-300' : 'text-green-300';

  return (
    <div
      className={`rounded-lg p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${cardClasses} ${glowAnimation}`}
    >
      <div className='flex items-start space-x-3'>
        {/* Icon with glow */}
        <div className={`flex-shrink-0 ${isDangerous ? 'animate-pulse' : ''}`}>
          <Icon
            className={`h-6 w-6 ${iconColor} ${isDangerous ? 'drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]' : 'drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]'}`}
          />
        </div>

        {/* Content */}
        <div className='flex-grow space-y-1'>
          {/* Timestamp */}
          {event.timestamp && (
            <p className={`text-xs font-semibold ${timestampColor}`}>
              {event.timestamp}
            </p>
          )}

          {/* Description */}
          <p className={`text-sm leading-relaxed ${textColor}`}>
            {event.description}
          </p>
        </div>

        {/* Resolve Button */}
        <Button
          size='sm'
          variant='ghost'
          onClick={onResolve}
          className={`flex-shrink-0 transition-all ${
            isDangerous
              ? 'hover:bg-red-800/50 text-red-200 hover:text-red-100'
              : 'hover:bg-green-800/50 text-green-200 hover:text-green-100'
          }`}
        >
          <XCircleIcon className='h-4 w-4' />
        </Button>
      </div>

      {/* Danger indicator bar */}
      {isDangerous && (
        <div className='mt-2 flex items-center space-x-2'>
          <div className='h-1 flex-grow rounded-full bg-red-600/30'>
            <div className='h-full w-full animate-pulse rounded-full bg-red-500'></div>
          </div>
          <span className='text-xs font-bold text-red-400'>ALERT</span>
        </div>
      )}
    </div>
  );
};
