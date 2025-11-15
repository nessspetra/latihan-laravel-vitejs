import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, Link } from '@inertiajs/react'
import TrixEditor from '@/Components/TrixEditor'

export default function Edit({ todo }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'PUT',
    title: todo.title || '',
    note: todo.note || '',
    is_done: todo.is_done,
    cover: null,
  })

  const submit = (e) => {
    e.preventDefault()
    post(route('todos.update', todo.id), {
      forceFormData: true,
    })
  }

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Edit Todo</h2>}>
      <Head title="Edit Todo" />

      <div className="py-6 max-w-3xl mx-auto">
        <form onSubmit={submit} className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catatan</label>
            <TrixEditor inputName="note" value={data.note} onChange={(v) => setData('note', v)} />
            {errors.note && <p className="text-sm text-red-500">{errors.note}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover (biarkan kosong kalau tidak ganti)</label>
            <input
              type="file"
              onChange={(e) => setData('cover', e.target.files[0])}
              className="w-full"
            />
            {todo.cover && (
              <img
                src={`/storage/${todo.cover}`}
                className="h-16 w-16 object-cover rounded mt-2"
              />
            )}
            {errors.cover && <p className="text-sm text-red-500">{errors.cover}</p>}
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.is_done}
              onChange={(e) => setData('is_done', e.target.checked)}
            />
            Tandai selesai
          </label>

          <div className="flex justify-between">
            <Link href={route('todos.index')} className="text-sm text-slate-500">
              ← Kembali
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="bg-slate-900 text-white px-4 py-2 rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}
