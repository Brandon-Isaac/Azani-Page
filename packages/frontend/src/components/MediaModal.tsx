import { useEffect } from 'react';

export type MediaModalState =
  | { open: false }
  | { open: true; type: 'image'; src: string; title: string }
  | { open: true; type: 'video'; src: string; title: string };

interface MediaModalProps {
  state: MediaModalState;
  onClose: () => void;
}

export function MediaModal({ state, onClose }: MediaModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.open) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state.open, onClose]);

  if (!state.open) return null;

  return (
    <div
      id="mediaModal"
      className="modal"
      style={{ display: 'block' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div className="modal-content">
        <button type="button" className="close-button" onClick={onClose} aria-label="Close">
          &times;
        </button>
        {state.type === 'image' ? (
          <img className="modal-image" src={state.src} alt={state.title} style={{ display: 'block' }} />
        ) : (
          <video
            className="modal-video"
            style={{ display: 'block', width: '100%', maxHeight: '600px', borderRadius: '8px' }}
            controls
            autoPlay
          >
            <source src={state.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <p className="modal-title">{state.title}</p>
      </div>
    </div>
  );
}
