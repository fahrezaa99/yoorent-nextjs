export const dynamic = "force-dynamic";
export const revalidate = 0;

import CariBarangClient from "./CariBarangClient";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "./components/Navbar";

export default async function CariBarangPage() {
  const { data, error } = await supabase
    .from("barang")
    .select(`
      id,
      nama,
      foto,
      harga,
      harga_promo,
      harga_beli,
      bisaDibeli,
      kategori,
      lokasi,
      status,
      created_at,
      owner:profiles!user_id (
        id,
        nama,
        foto,
        verified
      )
    `)
    .order("created_at", { ascending: false });
console.log("SUPABASE DATA:", data);

  // Pastikan hasil array
  const productsFromServer = error ? [] : (data ?? []);

  return (
    <>
      <Navbar />
      <CariBarangClient productsFromServer={productsFromServer as any} />
    </>
  );
}
