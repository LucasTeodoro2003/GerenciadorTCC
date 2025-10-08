"use client"

import PageMessage, { PageMessageProps } from "@/features/actions/messageUsers/pageMessage";

export default function MessagePageClient({
  user,
  serviceTableMessage,
  products
}: PageMessageProps) {
  return <PageMessage user={user} serviceTableMessage={serviceTableMessage} products={products}/>;
}
