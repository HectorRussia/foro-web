import React from 'react';
import { motion } from 'framer-motion';

const AILoader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="relative mb-6">
                <div className="ai-loader-ring"></div>
            </div>
            
            <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="flex flex-col gap-2"
            >
                <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] ml-[0.3em]">
                    AI Analyst
                </span>
                <span className="text-gray-500 font-bold text-[11px] uppercase tracking-[0.2em] ml-[0.2em]">
                    Is scanning for best targets...
                </span>
            </motion.div>
        </div>
    );
};

export default AILoader;
