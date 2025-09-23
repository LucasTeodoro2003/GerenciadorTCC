"use client"

import PageMessage, { PageMessageProps } from "@/features/actions/messageUsers/pageMessage";

export default function MessagePageClient({
  user,
  serviceTableMessage,
}: PageMessageProps) {
  return <PageMessage user={user} serviceTableMessage={serviceTableMessage} />;
}
