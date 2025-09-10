export const skeletonAnimationStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .animate-shimmer {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.7;
    }
    50% {
      opacity: 0.4;
    }
  }
  
  .animate-pulse {
    animation: pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes skeleton-wave {
    0% {
      transform: translateX(-100%);
    }
    50%, 100% {
      transform: translateX(100%);
    }
  }
  
  .animate-wave-effect {
    position: relative;
    overflow: hidden;
  }
  
  .animate-wave-effect::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: skeleton-wave 1.5s infinite;
  }
  
  @keyframes fade-in-up {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
  }
`;