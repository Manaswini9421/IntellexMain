import React from 'react';
import { AlertTriangleIcon, ActivityIcon } from 'lucide-react';
import { DangerAlert } from './DangerAlert';
import { VideoEvent } from '../actions';
import { Badge } from '@/components/ui/badge';

interface NotificationPanelProps {
  events: VideoEvent[];
  onResolveEvent: (index: number) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  events,
  onResolveEvent,
}) => {
  const dangerCount = events.filter((e) => e.isDangerous).length;
  const normalCount = events.length - dangerCount;

  return (
    <div className='w-1/4 overflow-y-auto border-l-2 border-blue-900/50 bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-md'>
      {/* Header */}
      <div className='sticky top-0 z-10 border-b border-blue-900/50 bg-gray-900/95 px-4 py-3 backdrop-blur-md'>
        <div className='flex items-center justify-between'>
          <h2 className='flex items-center text-lg font-bold text-blue-300'>
            <ActivityIcon className='mr-2 h-5 w-5 text-blue-400' />
            Event Log
          </h2>
          <Badge
            variant='outline'
            className='border-blue-600 bg-blue-950/50 text-blue-300'
          >
            {events.length}
          </Badge>
        </div>

        {/* Stats */}
        {events.length > 0 && (
          <div className='mt-2 flex gap-2 text-xs'>
            {dangerCount > 0 && (
              <Badge
                variant='destructive'
                className='flex items-center gap-1 bg-red-600/20 text-red-400'
              >
                <AlertTriangleIcon className='h-3 w-3' />
                {dangerCount} Alert{dangerCount !== 1 ? 's' : ''}
              </Badge>
            )}
            {normalCount > 0 && (
              <Badge
                variant='outline'
                className='border-green-600 bg-green-950/30 text-green-400'
              >
                {normalCount} Normal
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Event List */}
      <div className='p-4'>
        {events.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12'>
            <ActivityIcon className='mb-3 h-16 w-16 text-gray-700' />
            <p className='text-center text-sm text-gray-500'>
              No events detected yet
            </p>
            <p className='mt-1 text-center text-xs text-gray-600'>
              Events will appear here as they are detected
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {events.map((event, index) => (
              <DangerAlert
                key={`${event.timestamp}-${index}`}
                event={event}
                onResolve={() => onResolveEvent(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
