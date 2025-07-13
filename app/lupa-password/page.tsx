export default function LupaPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <input type="email" placeholder="Masukkan email" className="border px-3 py-2 rounded mb-4" />
      <button className="bg-blue-600 text-white rounded px-4 py-2">Kirim Link Reset</button>
    </div>
  )
}
