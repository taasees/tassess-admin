import React, { useEffect, useState } from "react";
import { subscribe } from "../loadingEvents";

import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";
import { motion } from "framer-motion";

// Default values shown
function Loading() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribe(setLoading);
    return () => unsubscribe();
  }, []);

  return (
    <>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }} // smoother fade out
          transition={{ duration: 0.3 }}
          className="spinner"
        >
          <Helix size="120" speed="2.5" color="#f5b400" />;
        </motion.div>
      )}
    </>
  );
}

export default Loading;
