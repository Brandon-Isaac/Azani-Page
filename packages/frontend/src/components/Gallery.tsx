import { useState } from 'react';
import { MediaModal, type MediaModalState } from './MediaModal';

const screenshots = [
  {
    src: '/images/MenuImg.jpg',
    title: 'Detailed Menu',
    description: 'Complete project with real-time analytics and metrics',
    className: 'screenshot-1',
  },
  {
    src: '/images/dbImage.png',
    title: 'Database Management',
    description: 'Intuitive interface for managing your data efficiently',
    className: 'screenshot-2',
  },
  {
    src: '/images/reportImg.png',
    title: 'Analytics & Reports',
    description: 'Advanced reporting tools with customizable visualizations',
    className: 'screenshot-3',
  },
];

const videos = [
  {
    src: '/images/Documentation.mp4',
    title: 'Documentation Tutorial',
    description: 'Comprehensive walkthrough of the documentation features',
    thumbClass: 'video-2',
  },
  {
    src: '/images/Accessing access.mp4',
    title: 'Getting Started Guide',
    description: 'How to get started with accessing Azani',
    thumbClass: 'video-3',
  },
];

export function Gallery() {
  const [activeTab, setActiveTab] = useState<'screenshots' | 'videos'>('screenshots');
  const [media, setMedia] = useState<MediaModalState>({ open: false });

  const openImage = (src: string, title: string) => {
    document.body.style.overflow = 'hidden';
    setMedia({ open: true, type: 'image', src, title });
  };

  const openVideo = (src: string, title: string) => {
    document.body.style.overflow = 'hidden';
    setMedia({ open: true, type: 'video', src, title });
  };

  const closeMedia = () => {
    document.body.style.overflow = 'auto';
    setMedia({ open: false });
  };

  return (
    <section id="gallery" className="gallery">
      <div className="gallery-container">
        <h2 className="section-title">See Azani in Action</h2>
        <p className="section-subtitle">Explore our screenshots and video demonstrations</p>

        <div className="gallery-tabs">
          <button
            type="button"
            className={`tab-button ${activeTab === 'screenshots' ? 'active' : ''}`}
            onClick={() => setActiveTab('screenshots')}
          >
            📸 Screenshots
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            🎬 Video Demos
          </button>
        </div>

        <div
          id="screenshots"
          className={`tab-content ${activeTab === 'screenshots' ? 'active' : ''}`}
        >
          <div className="screenshots-grid">
            {screenshots.map((item) => (
              <div
                key={item.title}
                className="gallery-item clickable-image"
                role="button"
                tabIndex={0}
                onClick={() => openImage(item.src, item.title)}
                onKeyDown={(e) => e.key === 'Enter' && openImage(item.src, item.title)}
              >
                <div className={`gallery-image ${item.className}`}>
                  <img src={item.src} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="image-overlay">
                    <span className="image-label">Click to View</span>
                  </div>
                </div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="videos" className={`tab-content ${activeTab === 'videos' ? 'active' : ''}`}>
          <div className="videos-grid">
            {videos.map((item) => (
              <div
                key={item.title}
                className="video-item clickable-video"
                role="button"
                tabIndex={0}
                onClick={() => openVideo(item.src, item.title)}
                onKeyDown={(e) => e.key === 'Enter' && openVideo(item.src, item.title)}
              >
                <div className="video-frame">
                  <div className="play-button">▶</div>
                  <div className={`video-thumbnail ${item.thumbClass}`} />
                </div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MediaModal state={media} onClose={closeMedia} />
    </section>
  );
}
