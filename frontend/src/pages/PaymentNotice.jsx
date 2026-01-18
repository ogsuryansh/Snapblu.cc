import { AlertCircle, Mail, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentNotice = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-gray-800/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Payment Notice
          </h1>

          {/* Main Message */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
            <p className="text-lg text-yellow-100 text-center leading-relaxed">
              The payment for this website to the developer has not been completed yet.
            </p>
          </div>

          {/* Additional Info */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-400" />
                Contact Information
              </h3>
              <p className="text-gray-300 text-sm">
                Please contact the administrator to resolve this payment issue and restore full access to the website.
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Current Status</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Limited functionality available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Full access pending payment completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Contact support for immediate assistance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <a
              href="mailto:support@snapblu.cc"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5" />
              Contact Support
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-400 text-sm mt-6">
            This is a temporary notice. Thank you for your patience.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentNotice;
