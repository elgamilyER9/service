import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// ألوان وفئات الخدمات
const categoryColors = {
  plumber: 'bg-blue-500',
  electrician: 'bg-yellow-500',
  carpenter: 'bg-green-500',
  default: 'bg-gray-400',
};

const categoryIcons = {
  plumber: '🛠️',
  electrician: '💡',
  carpenter: '🪚',
  default: '🔧',
};

const ServiceCard = ({ service, technicianId }) => {
  const { user } = useAuth();

  const categoryKey = service.category?.name?.toLowerCase() || 'default';
  const bgColor = categoryColors[categoryKey] || categoryColors.default;
  const icon = categoryIcons[categoryKey] || categoryIcons.default;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative flex flex-col h-full rounded-[2rem] overflow-hidden bg-white shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-2xl"
    >
      {/* Badge السعر */}
      <div className="absolute top-4 left-4 z-10">
        <div className="rounded-full border border-white/50 bg-white/90 px-4 py-1.5 text-sm font-black text-gray-900 shadow-xl backdrop-blur-md">
          {service.price} ج.م
        </div>
      </div>

      {/* Placeholder احترافي بدل الصورة */}
      <div
        className={`relative flex aspect-[16/11] items-center justify-center text-6xl font-black text-white ${bgColor}`}
      >
        <span>{icon}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-30"></div>
      </div>

      {/* تفاصيل الخدمة */}
      <div className="flex flex-col flex-grow p-7 text-right">
        {/* العنوان والإضافة للمفضلة */}
        <div className="mb-4 flex justify-between items-start">
          <button className="rounded-xl bg-gray-50 p-2 text-gray-400 transition-colors hover:text-red-500">
            <Bookmark className="h-5 w-5" />
          </button>
          <h3 className="text-2xl font-black leading-tight text-gray-900 transition-colors group-hover:text-blue-600">
            {service.name}
          </h3>
        </div>

        {/* وصف الخدمة */}
        <p className="mb-6 line-clamp-2 text-sm font-medium leading-relaxed text-gray-500">
          {service.description || 'خدمة احترافية عالية الجودة.'}
        </p>

        {/* المميزات */}
        <div className="mb-6 grid grid-cols-2 gap-4 text-xs font-bold">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-400">
            <Clock size={16} />
            <span>حجز فوري</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-blue-500">
            <ShieldCheck size={16} />
            <span>خدمة مؤمنة</span>
          </div>
        </div>

        {/* زر الحجز أو حالة التكنيشين */}
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
          {user?.role === 'technician' ? (
            <div className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
              متاحة لعملائك
            </div>
          ) : (
            <Link
              to={`/booking?service_id=${service.id}${technicianId ? `&tech_id=${technicianId}` : ''}`}
              className="rounded-2xl bg-gray-900 px-6 py-3 text-sm font-black text-white shadow-md transition-all hover:bg-blue-600"
            >
              احجز الآن
            </Link>
          )}

          {/* التقييم */}
          <div className="ml-2 flex items-center text-yellow-500">
            <Star size={18} fill="currentColor" />
            <span className="ml-1 text-lg font-black text-gray-900">4.8</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
