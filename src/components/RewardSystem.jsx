import { useState } from 'react';
import PropTypes from 'prop-types';

const RewardSystem = ({ onClose, reward, updatePlayerInventory, playerInventory }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Fungsi untuk menangani penutupan notifikasi reward
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // Jika tidak ada reward atau tidak visible, tidak render apapun
  if (!reward || !isVisible) return null;

  return (
    <div className="reward-notification">
      <div className="reward-content">
        <h3>Anda Mendapatkan Item!</h3>
        <div className="reward-item">
          <span className="item-icon">{reward.icon}</span>
          <div className="item-info">
            <div className="item-name">{reward.name}</div>
            <div className="item-description">{reward.description}</div>
          </div>
        </div>
        <button onClick={handleClose} className="close-reward">Tutup</button>
      </div>
    </div>
  );
};

RewardSystem.propTypes = {
  onClose: PropTypes.func,
  reward: PropTypes.object,
  updatePlayerInventory: PropTypes.func.isRequired,
  playerInventory: PropTypes.object.isRequired
};

export default RewardSystem;