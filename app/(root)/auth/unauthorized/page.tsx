"use client";

import {
  Lock,
  ArrowRight,
  RefreshCw,
  Home,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function UnauthorizedPage() {
  const [showRetry, setShowRetry] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setShowRetry(true);
          return 100;
        }
        return oldProgress + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-[#2e2838] p-4">
      {/* Glowing background effect */}
      <div className="bg-radial-gradient absolute inset-0 animate-pulse from-purple-500/20 via-transparent to-transparent"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden z-50"
      >
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-32 h-32 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Lock className="w-16 h-16 text-red-600 dark:text-red-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold text-center text-gray-800 dark:text-white mb-4"
            >
              401 - Unauthorized
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg"
            >
              Oops! It seems you don&apos;t have permission to access this page.
              This could be due to an expired session or insufficient
              privileges.
            </motion.p>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                What can you do?
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Check if you&apos;re logged in with the correct account</li>
                <li>Contact your administrator for access</li>
                <li>Return to the homepage and try again</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col space-y-4"
            >
              <Button
                asChild
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg"
              >
                <a href="/auth/login">
                  Go to Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-lg"
                  onClick={() => (window.location.href = "/")}
                >
                  <Home className="w-5 h-5 mr-2" />
                  Home
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-lg"
                  onClick={() => (window.location.href = "/help")}
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Help
                </Button>
              </div>

              <AnimatePresence>
                {showRetry && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                      <RefreshCw className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2"
        />

        <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
          <div className="flex items-center text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Security Notice</span>
          </div>
          <div className="w-1/2">
            <Progress value={progress} className="w-full" />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
