'use client';

/**
 * Channel 切换按钮组件
 */

import { formatAmount } from '@/lib/dataLoader';
import type { ChannelButtonData } from '@/lib/types';

interface ChannelButtonsProps {
  channels: ChannelButtonData[];
  selectedChannel: string | null;
  onChannelChange: (channel: string) => void;
}

export default function ChannelButtons({
  channels,
  selectedChannel,
  onChannelChange,
}: ChannelButtonsProps) {
  if (channels.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        暂无数据
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {channels.map(({ channel, total }) => (
        <button
          key={channel}
          onClick={() => onChannelChange(channel)}
          className={`
            p-4 rounded-lg border-2 transition-all text-left
            ${
              selectedChannel === channel
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }
          `}
        >
          <div className="text-sm text-gray-400 mb-1">{channel}</div>
          <div className="text-2xl font-bold text-gray-100">
            {formatAmount(total)}
          </div>
        </button>
      ))}
    </div>
  );
}
