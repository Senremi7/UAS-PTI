import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ItemStyles.css';

const ItemSystem = ({ playerStats, updatePlayerStats, playerInventory, updatePlayerInventory, playerMoney, updatePlayerMoney }) => {
  const [showShop, setShowShop] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Definisi item dalam game
  const itemDatabase = {
    // Consumable items (meningkatkan statistik)
    vitamin: {
      id: 'vitamin',
      name: 'Vitamin',
      description: 'Meningkatkan energi sebesar 20 poin',
      price: 50,
      type: 'consumable',
      effects: { energi: 20 },
      icon: '💊'
    },
    makanan: {
      id: 'makanan',
      name: 'Makanan Siap Saji',
      description: 'Meningkatkan kenyang sebesar 30 poin',
      price: 30,
      type: 'consumable',
      effects: { kenyang: 30 },
      icon: '🍲'
    },
    obat: {
      id: 'obat',
      name: 'Obat',
      description: 'Meningkatkan kesehatan sebesar 25 poin',
      price: 60,
      type: 'consumable',
      effects: { kesehatan: 25 },
      icon: '💊'
    },
    buku: {
      id: 'buku',
      name: 'Buku Pengetahuan',
      description: 'Meningkatkan kecerdasan sebesar 15 poin',
      price: 40,
      type: 'consumable',
      effects: { kecerdasan: 15 },
      icon: '📚'
    },
    
    // Key items (membuka aktivitas)
    kartuGym: {
      id: 'kartuGym',
      name: 'Kartu Gym',
      description: 'Membuka akses ke aktivitas Fitness',
      price: 100,
      type: 'key',
      unlocksActivity: 'fitness',
      icon: '🏋️'
    },
    alatPancing: {
      id: 'alatPancing',
      name: 'Alat Pancing',
      description: 'Membuka akses ke aktivitas Memancing',
      price: 120,
      type: 'key',
      unlocksActivity: 'memancing',
      icon: '🎣'
    },
    alatBerkebun: {
      id: 'alatBerkebun',
      name: 'Alat Berkebun',
      description: 'Membuka akses ke aktivitas Berkebun',
      price: 90,
      type: 'key',
      unlocksActivity: 'berkebun',
      icon: '🌿'
    },
    
    // Reward items (didapat dari aktivitas)
    ikan: {
      id: 'ikan',
      name: 'Ikan',
      description: 'Hasil dari aktivitas memancing. Dapat dijual atau dimakan (+10 energi).',
      price: 25, // harga jual
      type: 'reward',
      consumable: true,
      effects: { energi: 10 },
      icon: '🐟'
    },
    buah: {
      id: 'buah',
      name: 'Buah',
      description: 'Hasil dari aktivitas berkebun. Dapat dijual atau dimakan (+15 kenyang).',
      price: 15,
      type: 'reward',
      consumable: true,
      effects: { kenyang: 15 },
      icon: '🍎'
    }
  };

  // Tidak perlu fungsi toggleInventory karena inventaris selalu ditampilkan

  // Fungsi untuk membuka/menutup toko
  const toggleShop = () => {
    setShowShop(prev => !prev);
    setSelectedItem(null);
  };

  // Fungsi untuk memilih item
  const selectItem = (itemId) => {
    setSelectedItem(itemDatabase[itemId]);
  };

  // Fungsi untuk menggunakan item
  const useItem = (itemId) => {
    const item = itemDatabase[itemId];
    
    // Cek apakah item ada di inventaris
    if (!playerInventory[itemId] || playerInventory[itemId] <= 0) {
      return;
    }
    
    // Jika item adalah consumable, terapkan efeknya
    if (item.type === 'consumable' || (item.type === 'reward' && item.consumable)) {
      const updatedStats = { ...playerStats };
      
      // Terapkan efek item pada statistik pemain
      Object.entries(item.effects).forEach(([stat, value]) => {
        if (updatedStats[stat] !== undefined) {
          updatedStats[stat] = Math.min(100, updatedStats[stat] + value);
        }
      });
      
      // Update statistik pemain
      updatePlayerStats(updatedStats);
      
      // Kurangi jumlah item di inventaris
      const updatedInventory = { ...playerInventory };
      updatedInventory[itemId] -= 1;
      
      // Hapus item dari inventaris jika jumlahnya 0
      if (updatedInventory[itemId] <= 0) {
        delete updatedInventory[itemId];
      }
      
      updatePlayerInventory(updatedInventory);
      setSelectedItem(null);
    }
  };

  // Fungsi untuk membeli item
  const buyItem = (itemId) => {
    const item = itemDatabase[itemId];
    
    // Cek apakah pemain memiliki cukup uang
    if (playerMoney < item.price) {
      return;
    }
    
    // Kurangi uang pemain
    updatePlayerMoney(playerMoney - item.price);
    
    // Tambahkan item ke inventaris
    const updatedInventory = { ...playerInventory };
    updatedInventory[itemId] = (updatedInventory[itemId] || 0) + 1;
    updatePlayerInventory(updatedInventory);
  };

  // Fungsi untuk menjual item
  const sellItem = (itemId) => {
    const item = itemDatabase[itemId];
    
    // Cek apakah item ada di inventaris
    if (!playerInventory[itemId] || playerInventory[itemId] <= 0) {
      return;
    }
    
    // Tambah uang pemain (80% dari harga beli)
    const sellPrice = Math.floor(item.price * 0.8);
    updatePlayerMoney(playerMoney + sellPrice);
    
    // Kurangi jumlah item di inventaris
    const updatedInventory = { ...playerInventory };
    updatedInventory[itemId] -= 1;
    
    // Hapus item dari inventaris jika jumlahnya 0
    if (updatedInventory[itemId] <= 0) {
      delete updatedInventory[itemId];
    }
    
    updatePlayerInventory(updatedInventory);
    setSelectedItem(null);
  };

  // Cek apakah pemain memiliki item yang membuka aktivitas tertentu
  const hasItemForActivity = (activityId) => {
    for (const itemId in playerInventory) {
      const item = itemDatabase[itemId];
      if (item.type === 'key' && item.unlocksActivity === activityId) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="item-system">
      <div className="item-buttons">
        <button onClick={toggleShop} className="shop-button">
          Toko
        </button>
      </div>

      {/* Tampilan Inventaris - Selalu Muncul */}
      <div className="inventory-panel">
        <div className="panel-header">
          <h3>Inventaris</h3>
          <div className="money-display">Koin: {playerMoney}</div>
        </div>
          
          <div className="inventory-content">
            <div className="item-list">
              {Object.keys(playerInventory).length === 0 ? (
                <p className="empty-message">Inventaris kosong</p>
              ) : (
                Object.entries(playerInventory).map(([itemId, quantity]) => (
                  <div 
                    key={itemId}
                    className={`item-entry ${selectedItem && selectedItem.id === itemId ? 'selected' : ''}`}
                    onClick={() => selectItem(itemId)}
                  >
                    <span className="item-icon">{itemDatabase[itemId].icon}</span>
                    <span className="item-name">{itemDatabase[itemId].name}</span>
                    <span className="item-quantity">x{quantity}</span>
                  </div>
                ))
              )}
            </div>
            
            {selectedItem && (
              <div className="item-details">
                <h4>{selectedItem.name}</h4>
                <p className="item-description">{selectedItem.description}</p>
                
                <div className="item-actions">
                  {(selectedItem.type === 'consumable' || 
                    (selectedItem.type === 'reward' && selectedItem.consumable)) && (
                    <button 
                      onClick={() => useItem(selectedItem.id)}
                      className="use-button"
                    >
                      Gunakan
                    </button>
                  )}
                  
                  <button 
                    onClick={() => sellItem(selectedItem.id)}
                    className="sell-button"
                  >
                    Jual ({Math.floor(selectedItem.price * 0.8)} koin)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tampilan Toko */}
      {showShop && (
        <div className="shop-panel">
          <div className="panel-header">
            <h3>Toko</h3>
            <div className="money-display">Koin: {playerMoney}</div>
            <button onClick={toggleShop} className="close-button">×</button>
          </div>
          
          <div className="shop-content">
            <div className="item-list">
              {Object.values(itemDatabase)
                .filter(item => item.type !== 'reward') // Reward items tidak dijual di toko
                .map(item => (
                  <div 
                    key={item.id}
                    className={`item-entry ${selectedItem && selectedItem.id === item.id ? 'selected' : ''}`}
                    onClick={() => selectItem(item.id)}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">{item.price} koin</span>
                  </div>
                ))}
            </div>
            
            {selectedItem && (
              <div className="item-details">
                <h4>{selectedItem.name}</h4>
                <p className="item-description">{selectedItem.description}</p>
                
                <div className="item-actions">
                  <button 
                    onClick={() => buyItem(selectedItem.id)}
                    className="buy-button"
                    disabled={playerMoney < selectedItem.price}
                  >
                    Beli ({selectedItem.price} koin)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ItemSystem.propTypes = {
  playerStats: PropTypes.object.isRequired,
  updatePlayerStats: PropTypes.func.isRequired,
  playerInventory: PropTypes.object.isRequired,
  updatePlayerInventory: PropTypes.func.isRequired,
  playerMoney: PropTypes.number.isRequired,
  updatePlayerMoney: PropTypes.func.isRequired
};

export default ItemSystem;