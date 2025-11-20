"use client";

import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export const TypewriterEffect = ({
  staticWords,
  dynamicWords,
  className,
  cursorClassName,
}: {
  staticWords: {
    text: string;
    className?: string;
  }[];
  dynamicWords: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const staticWordsArray = staticWords.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));
  const dynamicWordsArray = dynamicWords.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    const animateWords = async () => {
      // Hide all dynamic words initially
      await animate(".dynamic-char", { opacity: 0, display: "none" }, { duration: 0 });
      
      // Write static words once
      await animate(
        ".static-char",
        { display: "inline-block", opacity: 1 },
        { duration: 0.2, delay: stagger(0.1), ease: "easeInOut" }
      );
      
      await new Promise((resolve) => setTimeout(resolve, 500));

      let dynamicWordIndex = 0;
      while (true) {
        const currentWordSelector = `.dynamic-word-${dynamicWordIndex} .dynamic-char`;
        
        // Ensure all dynamic words are hidden before typing the new one
        await animate(".dynamic-char", { opacity: 0, display: "none" }, { duration: 0 });
        
        // Writing animation for the current dynamic word
        await animate(
          currentWordSelector,
          { display: "inline-block", opacity: 1 },
          { duration: 0.1, delay: stagger(0.08), ease: "easeInOut" }
        );

        // Pause after writing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Erasing animation for the current dynamic word
        await animate(
          currentWordSelector,
          { opacity: 0 },
          { duration: 0.05, delay: stagger(0.03, { from: "last" }), ease: "easeInOut" }
        );

        // Explicitly hide spans after erasing to prevent them from taking up space
        await animate(currentWordSelector, { display: "none" }, { duration: 0 });

        // Move to the next word
        dynamicWordIndex = (dynamicWordIndex + 1) % dynamicWordsArray.length;

        // Pause before writing the next word
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    };

    if (isInView) {
      animateWords();
    }
  }, [isInView, animate, dynamicWordsArray.length]);

  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      <motion.div ref={scope} className="inline">
        {staticWordsArray.map((word, idx) => (
          <div key={`static-word-${idx}`} className="inline-block">
            {word.text.map((char, index) => (
              <motion.span
                key={`static-char-${idx}-${index}`}
                className={cn("static-char dark:text-white text-black opacity-0", word.className)}
              >
                {char}
              </motion.span>
            ))}
            &nbsp;
          </div>
        ))}
        {dynamicWordsArray.map((word, wordIdx) => (
          <div key={`dynamic-word-${wordIdx}`} className={`inline-block dynamic-word-${wordIdx}`}>
            {word.text.map((char, charIdx) => (
              <motion.span
                key={`dynamic-char-${wordIdx}-${charIdx}`}
                className={cn("dynamic-char opacity-0", word.className)}
                style={{ display: "none" }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        ))}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-6 sm:h-8 md:h-10 lg:h-12 bg-primary align-bottom ml-1",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
