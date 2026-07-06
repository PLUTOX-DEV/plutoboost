import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Sparkles, Search, ArrowRight } from "lucide-react";
import api from "../api";
import LoadingSpinner from "./LoadingSpinner";

export default function ServicePricingPage() {
  const { platform } = useParams();
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/services?platform=${platform}`);
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [platform]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const title = `${platform.charAt(0).toUpperCase() + platform.slice(1)} Services`;
  const description = `Explore our wide range of ${platform} services to boost your presence. All prices are per 1,000 units.`;

  return (
    <div className="min-h-screen bg-[#07091F] text-white pt-32 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4"
      >
        <div className="text-center mb-12">
          <Sparkles className="mx-auto h-12 w-12 text-purple-400 mb-4" />
          <h1 className="text-5xl font-bold gradient-text">{title}</h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="relative mb-8">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={`Search ${platform} services...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full input-glass pl-12 py-3"
          />
        </div>

        {loading ? (
          <LoadingSpinner text={`Fetching ${platform} services...`} />
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black/40 text-gray-400">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">Service ID</th>
                    <th className="px-6 py-4 text-left font-medium">Service Name</th>
                    <th className="px-6 py-4 text-left font-medium">Price / 1k</th>
                    <th className="px-6 py-4 text-left font-medium">Min/Max</th>
                    <th className="px-6 py-4 text-left font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <motion.tr
                      key={service.service}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4 font-mono text-purple-400">{service.service}</td>
                      <td className="px-6 py-4">{service.name}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        {/* Corrected: Display the final per-unit price */}
                        ₦{parseFloat(service.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {service.min} / {service.max}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/dashboard?service=${service.service}`}
                          className="btn-primary-sm flex items-center gap-2"
                        >
                          Order <ArrowRight size={14} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}