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
        className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 drop-shadow-lg leading-tight"
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
        className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto drop-shadow-md leading-relaxed px-4 sm:px-0"
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