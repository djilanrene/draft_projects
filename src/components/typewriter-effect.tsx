"use client";

import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    const animateWords = async () => {
        // Initial animation to hide everything
        await animate("span", { opacity: 0, display: "none" }, { duration: 0 });

        while (true) {
            // Writing animation
            await animate(
                "span",
                {
                    display: "inline-block",
                    opacity: 1,
                },
                {
                    duration: 0.2,
                    delay: stagger(0.1),
                    ease: "easeInOut",
                }
            );

            // Pause after writing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Erasing animation
            await animate(
                "span",
                {
                    opacity: 0,
                },
                {
                    duration: 0.1,
                    delay: stagger(0.05, { from: "last" }),
                    ease: "easeInOut",
                }
            );
            
            // Hide spans after erasing
            await animate("span", { display: "none" }, { duration: 0 });

            // Pause after erasing
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    };

    if (isInView) {
        animateWords();
    }
  }, [isInView, animate]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{ opacity: 0, display: "none" }}
                  key={`char-${index}`}
                  className={cn(
                    `dark:text-white text-black`,
                    word.className
                  )}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-6 sm:h-8 md:h-10 lg:h-12 bg-primary align-bottom",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
