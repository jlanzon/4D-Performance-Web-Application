import React, { useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiXSquare } from "react-icons/fi";
import { DarkModeContext } from "../../context/Theme"; // Adjust path as needed

export const NeuPricing = () => {
  const { isDark } = useContext(DarkModeContext); // Dark mode context
  const [selected, setSelected] = useState("annual");

  return (
    <div
      // initial={{ opacity: 0, y: 20 }}
      // whileInView={{ opacity: 1, y: 0 }}
      className={`py-24 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2
          className={`mx-auto mb-12 max-w-2xl text-center text-3xl md:text-4xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Pricing Plans
        </h2>
        <Toggle selected={selected} setSelected={setSelected} isDark={isDark} />
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <PriceColumn
            title="Individuals"
            price={selected === "monthly" ? "29" : "19"}
            statement="For individuals looking to up their productivity gains."
            items={[
              { children: "1 Team Member", checked: true },
              { children: "3 Boards", checked: true },
              { children: "5 Workflows", checked: true },
              { children: "Upgraded Support", checked: false },
              { children: "Custom Branding", checked: false },
            ]}
            isDark={isDark}
          />
          <PriceColumn
            title="Teams"
            price={selected === "monthly" ? "79" : "53"}
            statement="For teams looking to scale efficiently. Stay on track."
            highlight
            items={[
              { children: "∞ Team Members", checked: true },
              { children: "∞ Boards", checked: true },
              { children: "∞ Workflows", checked: true },
              { children: "Upgraded Support", checked: true },
              { children: "Custom Branding", checked: false },
            ]}
            isDark={isDark}
          />
          <PriceColumn
            title="Enterprise"
            price={selected === "monthly" ? "199" : "133"}
            statement="For enterprises aiming for new heights. Manage without stress."
            items={[
              { children: "∞ Team Members", checked: true },
              { children: "∞ Boards", checked: true },
              { children: "∞ Workflows", checked: true },
              { children: "Enterprise Support", checked: true },
              { children: "Custom Branding", checked: true },
            ]}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
};

const PriceColumn = ({ highlight, title, price, statement, items, isDark }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative w-full rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-shadow ${
        highlight
          ? isDark
            ? "bg-gray-800 border-2 border-gray-700"
            : "bg-white border-2 border-gray-300"
          : isDark
          ? "bg-gray-800"
          : "bg-white"
      }`}
    >
      {highlight && (
        <span className="absolute right-4 top-0 -translate-y-1/2 rounded-full bg-indigo-600 px-2 py-0.5 text-sm text-white">
          Most Popular
        </span>
      )}
      <p
        className={`text-xl font-semibold mb-6 ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {title}
      </p>
      <div className="mb-6 flex items-center gap-3">
        <AnimatePresence mode="popLayout">
          <motion.span
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            key={price}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`text-5xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            £{price}
          </motion.span>
        </AnimatePresence>
        <motion.div
          layout
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          <span className="block">/user</span>
          <span className="block">/month</span>
        </motion.div>
      </div>
      <p className={`mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {statement}
      </p>
      <div className="mb-8 space-y-3">
        {items.map((i) => (
          <CheckListItem key={i.children} checked={i.checked} isDark={isDark}>
            {i.children}
          </CheckListItem>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className={`w-full rounded-full py-3 text-sm uppercase transition-colors ${
          highlight
            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
            : isDark
            ? "bg-gray-700 hover:bg-gray-600 text-gray-50"
            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
        }`}
      >
        Try it Now
      </motion.button>
    </motion.div>
  );
};

const Toggle = ({ selected, setSelected, isDark }) => {
  return (
    <div
      className={`relative mx-auto mt-3 flex w-fit items-center rounded-full ${
        isDark ? "bg-gray-800" : "bg-gray-200"
      }`}
    >
      <button
        className={`relative z-10 px-4 py-1.5 text-sm font-medium ${
          selected === "monthly"
            ? isDark
              ? "text-white"
              : "text-gray-900"
            : isDark
            ? "text-gray-400"
            : "text-gray-600"
        }`}
        onClick={() => setSelected("monthly")}
      >
        Monthly
      </button>
      <button
        className={`relative z-10 px-4 py-1.5 text-sm font-medium ${
          selected === "annual"
            ? isDark
              ? "text-white"
              : "text-gray-900"
            : isDark
            ? "text-gray-400"
            : "text-gray-600"
        }`}
        onClick={() => setSelected("annual")}
      >
        Annually
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${
          selected === "annual" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ ease: "easeInOut" }}
          className={`h-full w-1/2 rounded-full ${
            isDark ? "bg-gray-700 border border-gray-600" : "bg-white border border-gray-300"
          }`}
        />
      </div>
    </div>
  );
};

const CheckListItem = ({ children, checked, isDark }) => {
  return (
    <div className="flex items-center gap-2 text-base">
        
      {checked ? (
        <FiCheckCircle
          className={`text-lg ${isDark ? "text-indigo-500" : "text-indigo-600"}`}
        />
      ) : (
        <FiXSquare
          className={`text-lg ${isDark ? "text-gray-500" : "text-gray-400"}`}
        />
      )}
      <span className={isDark ? "text-gray-300" : "text-gray-700"}>
        {children}
      </span>
    </div>
  );
};