import PhonePeCallback from "@/components/pages/PhonePeCallback";

// PhonePe payment callback handler
export const metadata = {
  title: "Payment Processing | Aura Elixir",
  description: "Processing your payment...",
};

export default function Page() {
  return <PhonePeCallback />;
}
