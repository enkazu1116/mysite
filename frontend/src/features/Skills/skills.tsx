import { Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LoadingState } from "../../components/status";
import Table from "./components/table";

export default function Skills() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="flex-1 px-4 pb-10 pt-6 sm:px-6">
      <section className="mx-auto w-full max-w-3xl text-left">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h1 className="font-display m-0 text-4xl font-semibold tracking-tight text-[var(--lib-ink)] sm:text-5xl">
            Skills
          </h1>
          <p className="mt-2 max-w-xl text-base text-[var(--lib-ink-muted)]">
            使っている言語と経験の一覧です。
          </p>
        </motion.div>
      </section>
      <div className="mt-8">
        <Suspense fallback={<LoadingState />}>
          <Table />
        </Suspense>
      </div>
    </main>
  );
}
