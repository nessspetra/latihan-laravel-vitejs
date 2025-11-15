// resources/js/Pages/Todos/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'
import React, { useEffect } from 'react'
import Swal from 'sweetalert2'
import Chart from 'react-apexcharts'

export default function Index({ todos, filters, stats = { done: 0, pending: 0 }, flash }) {
  // munculin alert sukses dari flash
  useEffect(() => {
    if (flash?.success) {
      Swal.fire('Berhasil', flash.success, 'success')
    }
  }, [flash])

  const onSearch = (e) => {
    e.preventDefault()
    router.get(
      route('todos.index'),
      {
        q: e.target.q.value,
        status: e.target.status.value,
      },
      { preserveState: true }
    )
  }

  return (
    <AuthenticatedLayout>
      <Head title="Todos" />

      <div className="py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:px-6 lg:px-8">
          {/* chart */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-4 text-sm font-semibold">Statistik Todos</h3>
            <Chart
              type="donut"
              height={250}
              series={[stats.done, stats.pending]}
              options={{
                labels: ['Selesai', 'Belum'],
                colors: ['#10b981', '#0ea5e9'],
                dataLabels: {
                  style: { colors: ['#fff'] },
                },
              }}
            />
          </div>

          {/* card utama */}
          <div className="rounded-lg bg-white p-4 shadow">
            {/* filter */}
            <form onSubmit={onSearch} className="mb-4 flex flex-wrap items-center gap-3">
              <input
                name="q"
                defaultValue={filters?.q || ''}
                placeholder="Cari judul..."
                className="rounded-md border px-3 py-2"
              />
              <select
                name="status"
                defaultValue={filters?.status || ''}
                className="rounded-md border px-3 py-2"
              >
                <option value="">Semua status</option>
                <option value="done">Selesai</option>
                <option value="pending">Belum</option>
              </select>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
              >
                Terapkan
              </button>

              <Link
                href={route('todos.create')}
                className="ml-auto rounded-md bg-emerald-500 px-4 py-2 text-sm text-white"
              >
                + Tambah Todo
              </Link>
            </form>

            {/* table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Judul</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Cover</th>
                    <th className="py-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.data.map((todo) => (
                    <tr key={todo.id} className="border-b">
                      {/* JUDUL BISA DIKLIK */}
                      <td className="py-2">
                        <Link
                          href={route('todos.show', todo.id)}
                          className="font-medium text-slate-900 hover:underline"
                        >
                          {todo.title}
                        </Link>
                      </td>
                      <td className="py-2">
                        {todo.is_done ? (
                          <span className="text-green-600">Selesai</span>
                        ) : (
                          <span className="text-orange-500">Belum</span>
                        )}
                      </td>
                      <td className="py-2">
                        {todo.cover ? (
                          <img
                            src={`/storage/${todo.cover}`}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-2 space-x-2">
                        <Link
                          href={route('todos.edit', todo.id)}
                          className="text-slate-900 underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            Swal.fire({
                              title: 'Hapus?',
                              text: 'Yakin hapus todo ini?',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonText: 'Ya, hapus',
                              cancelButtonText: 'Batal',
                            }).then((res) => {
                              if (res.isConfirmed) {
                                router.delete(route('todos.destroy', todo.id), {
                                  preserveScroll: true,
                                })
                              }
                            })
                          }}
                          className="text-red-500 underline"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}

                  {todos.data.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-400">
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="mt-4 flex gap-2">
              {todos.links.map((link) => (
                <button
                  key={link.label}
                  onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                  className={`rounded px-3 py-1 ${
                    link.active ? 'bg-slate-900 text-white' : 'bg-slate-100'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
