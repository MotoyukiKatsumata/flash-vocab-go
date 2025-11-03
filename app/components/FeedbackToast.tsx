'use client';

import { useEffect, useState } from 'react';

type FeedbackType = 'correct' | 'incorrect' | null;
type Props = {
  feedback: {
    type: FeedbackType;
    message: string;
  } | null;
  onClose: () => void;
};

export default function FeedbackToast({ feedback, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!feedback) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const duration = feedback.type === 'correct' ? 1000 : 3000; // 正解1秒, 不正解3秒

    const timer = setTimeout(() => {
      setIsVisible(false);
      // アニメーションが終わるのを待ってから onClose を呼ぶ
      const closeTimer = setTimeout(onClose, 300); 
      return () => clearTimeout(closeTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [feedback, onClose]);

  if (!feedback || !isVisible) {
    return null;
  }

  const bgColor = feedback.type === 'correct' 
    ? 'bg-green-600' 
    : 'bg-red-600';

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-xl text-white font-bold text-center z-50 transition-all duration-300
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      ${bgColor}
    `}>
      {feedback.message}
    </div>
  );
}
