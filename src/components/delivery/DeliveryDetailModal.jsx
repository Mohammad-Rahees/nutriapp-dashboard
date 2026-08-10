import React from 'react';
import { 
  X, 
  Package, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  IndianRupee, 
  Navigation,
  FileText,
  Truck,
  Shield
} from 'lucide-react';
import DeliveryTimeline from './DeliveryTimeline';

const DeliveryDetailModal = ({ isOpen, onClose, order, log, activityHistory = [] }) => {
  if (!isOpen || (!order && !log)) return null;

  // Normalize order object whether passed direct or via log
  const activeOrder = order || log?.order || {};
  const deliveryPerson = log?.deliveryPerson || activeOrder?.deliveryPerson || null;
  const customerName = activeOrder?.deliveryPhone 
    ? (activeOrder?.user?.name || log?.customerName || 'Customer') 
    : (log?.customerName || activeOrder?.user?.name || activeOrder?.user?.username || 'Customer');
  const customerPhone = activeOrder?.deliveryPhone || log?.customerPhone || activeOrder?.user?.phone || '+91 9876543210';
  const deliveryAddress = activeOrder?.deliveryAddress || log?.deliveryAddress || activeOrder?.user?.address || 'Standard Address';
  const isCOD = activeOrder?.paymentStatus !== 'Paid' && !activeOrder?.paymentCollected;

  const orderIdShort = activeOrder?._id 
    ? String(activeOrder._id).substring(String(activeOrder._id).length - 8).toUpperCase()
    : 'N/A';

  const getGoogleMapsSearchUrl = (address, location) => {
    if (location?.lat && location?.lng) {
      return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    }
    const query = encodeURIComponent(address || 'Customer Location');
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden my-8 transform transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs font-bold bg-white/20 px-3 py-1 rounded-xl text-purple-100 backdrop-blur-md">
              Order #{orderIdShort}
            </span>
            <span className="text-xs font-semibold bg-purple-500/30 border border-purple-400/30 text-purple-200 px-3 py-1 rounded-full uppercase">
              {activeOrder?.deliveryStatus || log?.status || 'Assigned'}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white">Delivery Order Details</h2>
          <p className="text-xs text-purple-200 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Created: {new Date(activeOrder?.createdAt || log?.timestamp || Date.now()).toLocaleString()}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Delivery Person Information (Admin view / Log view) */}
          {deliveryPerson && (
            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">Assigned Delivery Agent</h4>
                  <p className="text-sm font-bold text-gray-900">{deliveryPerson?.name || deliveryPerson?.username || 'Delivery Person'}</p>
                  {deliveryPerson?.phone && (
                    <p className="text-xs text-purple-700 font-semibold">{deliveryPerson.phone}</p>
                  )}
                </div>
              </div>
              {deliveryPerson?.vehicleNumber && (
                <div className="text-right">
                  <span className="text-[10px] font-bold text-purple-500 uppercase">Vehicle</span>
                  <p className="text-xs font-extrabold text-purple-900">{deliveryPerson.vehicleType || 'Bike'} - {deliveryPerson.vehicleNumber}</p>
                </div>
              )}
            </div>
          )}

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h4>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{customerName}</h3>
                  <a href={`tel:${customerPhone}`} className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {customerPhone}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Full Delivery Address</h4>
                <p className="text-xs font-medium text-gray-700 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  {deliveryAddress}
                </p>
              </div>
              <div className="mt-3 text-right">
                <a
                  href={getGoogleMapsSearchUrl(deliveryAddress, activeOrder?.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200"
                >
                  <Navigation className="w-3.5 h-3.5" /> Open Maps Navigation
                </a>
              </div>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Ordered Items</h4>
            <div className="space-y-2">
              {activeOrder?.orderItems && activeOrder.orderItems.length > 0 ? (
                activeOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-200/60 last:border-0">
                    <span className="font-semibold text-gray-800">
                      {item.quantity}x {item.title || item.name}
                    </span>
                    <span className="font-bold text-gray-700">₹{item.price * item.quantity}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No specific items listed.</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-500 uppercase">Total Amount</span>
              <span className="text-xl font-black text-gray-900">₹{activeOrder?.totalAmount || log?.details?.totalAmount || 0}</span>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1">Payment Method & Status</h4>
              <p className="text-sm font-bold text-gray-900">
                {activeOrder?.paymentStatus === 'Paid' || activeOrder?.paymentCollected ? 'Paid Online / COD Collected' : 'Cash On Delivery (COD)'}
              </p>
            </div>
            <div>
              {isCOD ? (
                <span className="bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl inline-block">
                  Collect ₹{activeOrder?.totalAmount || 0}
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Payment Settled
                </span>
              )}
            </div>
          </div>

          {/* Delivery Notes */}
          {activeOrder?.deliveryNotes && (
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
              <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" /> Delivery Notes
              </h4>
              <p className="text-xs text-amber-900 font-medium">{activeOrder.deliveryNotes}</p>
            </div>
          )}

          {/* Delivery Timeline */}
          <div>
            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Delivery Timeline</h4>
            <DeliveryTimeline order={activeOrder} />
          </div>

          {/* Activity History Logs (if available) */}
          {activityHistory.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Audit Activity History</h4>
              <div className="space-y-2">
                {activityHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <div>
                      <span className="font-bold text-purple-700">{h.action}</span>
                      <span className="text-gray-400 mx-1.5">•</span>
                      <span className="text-gray-600 font-medium">{h.deliveryPerson?.name || 'Agent'}</span>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-right">
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailModal;
