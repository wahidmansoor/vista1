import { useEffect, useCallback } from 'react';
import type { Protocol } from '../../../../types/protocol';

interface UseProtocolKeyboardProps {
  protocols: Protocol[];
  selectedProtocol: Protocol | null;
  onSelectProtocol: (protocol: Protocol) => void;
  onCloseProtocol: () => void;
  onPrint?: () => void;
  isDrawerOpen: boolean;
}

const useProtocolKeyboard = ({
  protocols,
  selectedProtocol,
  onSelectProtocol,
  onCloseProtocol,
  onPrint,
  isDrawerOpen
}: UseProtocolKeyboardProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle keyboard shortcuts if user is typing in an input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    // Close drawer or deselect protocol with Escape
    if (event.key === 'Escape') {
      if (isDrawerOpen) {
        onCloseProtocol();
      }
      return;
    }

    // Print with Cmd/Ctrl + P
    if ((event.metaKey || event.ctrlKey) && event.key === 'p' && onPrint) {
      event.preventDefault();
      onPrint();
      return;
    }

    // Only handle navigation keys if a protocol is selected
    if (!selectedProtocol || !isDrawerOpen) return;

    const currentIndex = protocols.findIndex(p => p.id === selectedProtocol.id);
    if (currentIndex === -1) return;

    // Navigate between protocols with arrow keys
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + protocols.length) % protocols.length;
        onSelectProtocol(protocols[prevIndex]);
        break;
      }
      case 'ArrowRight':
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % protocols.length;
        onSelectProtocol(protocols[nextIndex]);
        break;
      }
      case 'Home': {
        event.preventDefault();
        onSelectProtocol(protocols[0]);
        break;
      }
      case 'End': {
        event.preventDefault();
        onSelectProtocol(protocols[protocols.length - 1]);
        break;
      }
    }
  }, [protocols, selectedProtocol, onSelectProtocol, onCloseProtocol, onPrint, isDrawerOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts: {
      close: 'Esc',
      print: '⌘/Ctrl + P',
      navigate: '← → ↑ ↓',
      first: 'Home',
      last: 'End'
    }
  };
};

export default useProtocolKeyboard;