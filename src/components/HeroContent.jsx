import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";

const HeroContent = ({ titleText, subtitleText, isLoadingTranslations, titleKey, subtitleKey }) => {
  const showTitleSkeleton = isLoadingTranslations && titleText === titleKey;
  const showSubtitleSkeleton = isLoadingTranslations && subtitleText === subtitleKey;

  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg"
      >
        {showTitleSkeleton ? (
          <>
            <Skeleton className="h-12 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-12 w-1/2 mx-auto" />
          </>
        ) : (
          titleText
        )}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto drop-shadow-md"
      >
        {showSubtitleSkeleton ? (
          <>
            <Skeleton className="h-6 w-full mx-auto mb-2" />
            <Skeleton className="h-6 w-5/6 mx-auto" />
          </>
        ) : (
          subtitleText
        )}
      </motion.p>
    </>
  );
};

export default HeroContent;