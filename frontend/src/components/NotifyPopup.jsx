import { useState, useEffect } from 'react';

function NotifyPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('notifyDismissed')) {
      const timer = setTimeout(() => setShowPopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Thanks for subscribing!', {
            body: "We'll keep you updated with eco-tasks and rewards",
            icon: '/assets/logo_1.png'
          });
        }
      });
    }
    localStorage.setItem('notifyDismissed', 'true');
    setShowPopup(false);
  };

  const handleDeny = () => {
    localStorage.setItem('notifyDismissed', 'true');
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="notify-popup active">
      <div className="notify-content">
        <h2>🔔Stay Updated!</h2>
        <p>Allow EcoEducation to send you notifications about latest eco-tasks, quizzes, and rewards.</p>
        <div className="notify-buttons">
          <button id="allow-btn" onClick={handleAllow}>Allow</button>
          <button id="deny-btn" onClick={handleDeny}>Not Now</button>
        </div>
      </div>
    </div>
  );
}

export default NotifyPopup;