import PropTypes from 'prop-types';

// Komponen untuk memeriksa persyaratan aktivitas
const ActivityRequirements = ({ playerInventory, itemDatabase }) => {
  // Fungsi untuk memeriksa apakah pemain memiliki item yang diperlukan untuk aktivitas tertentu
  const checkActivityRequirements = (activityId) => {
    switch (activityId) {
      case 'fitness':
        return hasItem('kartuGym');
      case 'memancing':
        return hasItem('alatPancing');
      case 'berkebun':
        return hasItem('alatBerkebun');
      default:
        return true; // Aktivitas tanpa persyaratan
    }
  };

  // Fungsi untuk memeriksa apakah pemain memiliki item tertentu
  const hasItem = (itemId) => {
    return playerInventory[itemId] && playerInventory[itemId] > 0;
  };

  // Fungsi untuk mendapatkan pesan persyaratan aktivitas
  const getRequirementMessage = (activityId) => {
    switch (activityId) {
      case 'fitness':
        return 'Membutuhkan Kartu Gym untuk mengakses';
      case 'memancing':
        return 'Membutuhkan Alat Pancing untuk mengakses';
      case 'berkebun':
        return 'Membutuhkan Alat Berkebun untuk mengakses';
      default:
        return '';
    }
  };

  return {
    checkActivityRequirements,
    getRequirementMessage
  };
};

ActivityRequirements.propTypes = {
  playerInventory: PropTypes.object.isRequired,
  itemDatabase: PropTypes.object.isRequired
};

export default ActivityRequirements;