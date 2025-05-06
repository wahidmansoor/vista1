import { useEffect, useCallback } from 'react';

interface KeyboardNavOptions {
  onNext?: () => void;
  onPrevious?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  enabled?: boolean;
}

export const useKeyboardNav = ({
  onNext,
  onPrevious,
  onSave,
  onCancel,
  enabled = true
}: KeyboardNavOptions) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Check if user is typing in an input or textarea
    if (
      document.activeElement?.tagName === 'INPUT' ||
      document.activeElement?.tagName === 'TEXTAREA'
    ) {
      return;
    }

    const { key, ctrlKey, metaKey } = event;

    // Navigation
    if (key === 'ArrowRight' && onNext) {
      event.preventDefault();
      onNext();
    }
    if (key === 'ArrowLeft' && onPrevious) {
      event.preventDefault();
      onPrevious();
    }

    // Save (Ctrl/Cmd + S)
    if ((ctrlKey || metaKey) && key.toLowerCase() === 's' && onSave) {
      event.preventDefault();
      onSave();
    }

    // Cancel (Escape)
    if (key === 'Escape' && onCancel) {
      event.preventDefault();
      onCancel();
    }
  }, [enabled, onNext, onPrevious, onSave, onCancel]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return {
    isEnabled: enabled,
    shortcuts: {
      next: '→',
      previous: '←',
      save: '⌘/Ctrl + S',
      cancel: 'Esc'
    }
  };
};