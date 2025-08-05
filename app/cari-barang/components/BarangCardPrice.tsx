function formatRupiah(num: number) {
  return "Rp " + num.toLocaleString("id-ID");
}

export default function BarangCardPrice({ harga, harga_promo, harga_beli, bisaDibeli }: any) {
  return (
    <div>
      <div className="flex items-end gap-2 mt-1 mb-1">
        {harga_promo ? (
          <>
            <span className="text-xs text-gray-400 line-through">{formatRupiah(harga)}</span>
            <span className="font-bold text-blue-700 text-xl">{formatRupiah(harga_promo)}</span>
          </>
        ) : (
          <span className="font-bold text-blue-700 text-xl">{formatRupiah(harga)}</span>
        )}
        <span className="text-xs font-semibold text-blue-600 pb-[2px]">/hari</span>
      </div>
      {bisaDibeli && harga_beli && (
        <div className="text-orange-500 font-bold text-sm flex items-center gap-1 mt-0.5">
          <span>{formatRupiah(harga_beli)}</span>
          <span className="text-xs text-gray-400 font-normal">/beli</span>
        </div>
      )}
    </div>
  );
}
