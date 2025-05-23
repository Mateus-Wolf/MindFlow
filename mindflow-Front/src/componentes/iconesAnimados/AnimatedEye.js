import { motion } from "framer-motion";

const AnimatedEye = ({ aberto = false }) => {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={false}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Contorno do olho */}
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      {/* Pupila */}
      <motion.circle
        cx="12"
        cy="12"
        r="3"
        animate={{
          r: aberto ? 3 : 0,
          opacity: aberto ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />
      {/* Linha que fecha o olho */}
      {!aberto && (
        <motion.line
          x1="1"
          y1="1"
          x2="23"
          y2="23"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.svg>
  );
};

export default AnimatedEye;
