import React from 'react';
import { 
  UserCheck, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  IndianRupee,
  Clock
} from 'lucide-react';

const DeliveryTimeline = ({ order, compact = false }) => {
  if (!order) return null;

  const timelineSteps = [
    {
      key: 'assignedAt',
      label: 'Assigned At',
      timestamp: order.assignedAt,
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      dotColor: 'bg-blue-600',
    },
    {
      key: 'pickedUpAt',
      label: 'Picked Up At',
      timestamp: order.pickedUpAt,
      icon: Package,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      dotColor: 'bg-purple-600',
    },
    {
      key: 'outForDeliveryAt',
      label: 'Out For Delivery At',
      timestamp: order.outForDeliveryAt,
      icon: Truck,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      dotColor: 'bg-amber-600',
    },
    {
      key: 'deliveredAt',
      label: 'Delivered At',
      timestamp: order.deliveredAt,
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      dotColor: 'bg-emerald-600',
    },
    {
      key: 'failedAt',
      label: 'Failed At',
      timestamp: order.failedAt,
      icon: XCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      dotColor: 'bg-rose-600',
    },
    {
      key: 'codCollectedAt',
      label: 'COD Collected At',
      timestamp: order.codCollectedAt,
      icon: IndianRupee,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      dotColor: 'bg-indigo-600',
    },
  ].filter((step) => Boolean(step.timestamp));

  if (timelineSteps.length === 0) {
    return (
      <div className="text-xs text-gray-400 italic py-2">
        No delivery timeline records available yet.
      </div>
    );
  }

  const formatDate = (ts) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) +
        ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return String(ts);
    }
  };

  if (compact) {
    return (
      <div className="space-y-1.5">
        {timelineSteps.map((step) => {
          const IconComponent = step.icon;
          return (
            <div key={step.key} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
              <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                <IconComponent className="w-3.5 h-3.5 text-gray-500" />
                {step.label}
              </span>
              <span className="font-mono text-[11px] text-gray-500 font-medium">
                {formatDate(step.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-purple-100 space-y-4 my-2">
      {timelineSteps.map((step) => {
        const IconComponent = step.icon;
        return (
          <div key={step.key} className="relative group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${step.dotColor}`} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${step.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-800">{step.label}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                <Clock className="w-3 h-3 text-gray-400" />
                {formatDate(step.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeliveryTimeline;
