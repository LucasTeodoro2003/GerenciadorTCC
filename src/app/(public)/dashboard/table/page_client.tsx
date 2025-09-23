"use client"

import TableUser, { TableUserProps } from "@/features/actions/users/page_client";
import { motion } from "framer-motion";


export default function TablePageClient({ users }: TableUserProps) {
    return (
<motion.div
              key="table-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              onAnimationComplete={() => {
              }}
            >
              <div className="flex flex-col w-full h-screen rounded-xl bg-muted/50 p-4 overflow-hidden">
                <div className="w-full h-full overflow-auto">
                  <TableUser users={users} />
                </div>
              </div>
            </motion.div>
    )
}