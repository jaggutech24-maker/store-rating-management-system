import React, { useEffect, useState, useCallback } from 'react';
import { Search, Store, Star, MessageSquare } from 'lucide-react';
import { storeService, ratingService } from '../../services/api';
import { Store as StoreType } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { StarRating } from '../../components/ui/StarRating';
import { Modal } from '../../components/ui/Modal';
import { Input, Button } from '../../components/ui/FormField';

const RatingModal: React.FC<{
  store: StoreType | null;
  onClose: () => void;
  onRated: () => void;
  userId: number;
}> = ({ store, onClose, onRated, userId }) => {
  const [rating, setRating] = useState(store?.userRating || 0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (store) setRating(store.userRating || 0);
    setSuccess(false);
  }, [store]);

  const handleSubmit = async () => {
    if (!store || rating === 0) return;
    try {
      setLoading(true);
      await ratingService.submitRating(userId, store.id, rating);
      setSuccess(true);
      setTimeout(() => {
        onRated();
        onClose();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!store} onClose={onClose} title={store?.userRating ? 'Update Your Rating' : 'Rate This Store'} size="sm">
      {store && (
        <div className="text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
            <Store className="h-7 w-7 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{store.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{store.address}</p>
          </div>

          {success ? (
            <div className="p-4 bg-green-50 rounded-xl text-green-700 font-medium">
              ✓ Rating submitted successfully!
            </div>
          ) : (
            <>
              <div className="flex justify-center py-2">
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>
              <p className="text-sm text-gray-500">
                {rating === 0 ? 'Select a rating' : `You selected ${rating} star${rating > 1 ? 's' : ''}`}
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={rating === 0}
                  className="flex-1"
                >
                  {store.userRating ? 'Update' : 'Submit'} Rating
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export const UserStoresPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);

  const loadStores = useCallback(() => {
    setLoading(true);
    storeService.getStores(user?.id).then(setStores).finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const filtered = stores.filter((s) => {
    const n = search.name.toLowerCase();
    const a = search.address.toLowerCase();
    return (
      (!n || s.name.toLowerCase().includes(n)) &&
      (!a || s.address.toLowerCase().includes(a))
    );
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 3.5) return 'text-blue-600 bg-blue-50';
    if (rating >= 2.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <Store className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Stores</h1>
          <p className="text-sm text-gray-500">Rate and explore all registered stores</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Search Stores</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Search by store name..."
            value={search.name}
            onChange={(e) => setSearch((s) => ({ ...s, name: e.target.value }))}
          />
          <Input
            placeholder="Search by address..."
            value={search.address}
            onChange={(e) => setSearch((s) => ({ ...s, address: e.target.value }))}
          />
        </div>
        {(search.name || search.address) && (
          <p className="text-xs text-gray-500 mt-2">{filtered.length} of {stores.length} stores shown</p>
        )}
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-gray-200 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full mb-4" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Store className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No stores found</p>
          <p className="text-sm">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              {/* Card Top */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                    <Store className="h-5 w-5 text-emerald-600" />
                  </div>
                  {store.averageRating > 0 && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRatingColor(store.averageRating)}`}>
                      {store.averageRating.toFixed(1)} ★
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{store.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{store.address}</p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-50 mx-5" />

              {/* Ratings Section */}
              <div className="px-5 py-3 bg-gray-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-medium text-gray-600">Overall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating value={Math.round(store.averageRating)} readonly size="sm" />
                    <span className="text-xs text-gray-500">({store.totalRatings})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="text-xs font-medium text-gray-600">Your rating</span>
                  </div>
                  {store.userRating ? (
                    <StarRating value={store.userRating} readonly size="sm" />
                  ) : (
                    <span className="text-xs text-gray-400 italic">Not rated yet</span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="px-5 pb-5 pt-3">
                <button
                  onClick={() => setSelectedStore(store)}
                  className={`w-full py-2 rounded-xl text-sm font-medium transition-all border ${
                    store.userRating
                      ? 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
                      : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200'
                  }`}
                >
                  {store.userRating ? '✏ Modify Rating' : '⭐ Rate This Store'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        onRated={loadStores}
        userId={user!.id}
      />
    </div>
  );
};
