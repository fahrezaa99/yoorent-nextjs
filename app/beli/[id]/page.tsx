import JualStepper from "@/components/jual/JualStepper";
import { supabase } from "@/lib/supabaseClient";

export default async function BeliPage({ params }: { params: { id: string } }) {
  // Fetch detail barang berdasarkan ID
  const { data: barang, error } = await supabase
    .from("barang")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !barang) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Barang tidak ditemukan!
      </div>
    );
  }

  return (
    <JualStepper barang={barang} />
  );
}
