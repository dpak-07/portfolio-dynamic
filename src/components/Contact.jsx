import { useState } from 'react'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const update = (k) => (e) => {
    console.log(`[DEBUG] Updating field: ${k} ->`, e.target.value)
    setForm((s) => ({ ...s, [k]: e.target.value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    console.log("[DEBUG] Form submit triggered")
    setStatus(null)
    setLoading(true)

    console.log("[DEBUG] Form Data:", form)
    console.log("[DEBUG] ENV Service ID:", import.meta.env.VITE_EMAILJS_SERVICE_ID)
    console.log("[DEBUG] ENV Template ID:", import.meta.env.VITE_EMAILJS_TEMPLATE_ID)
    console.log("[DEBUG] ENV Public Key:", import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      console.log("[DEBUG] EmailJS response:", result)

      setStatus({ type: 'success', text: '✅ Message sent! I’ll reply soon.' })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error("[DEBUG] EmailJS error:", err)
      setStatus({ type: 'error', text: '❌ Failed to send. Try again later.' })
    } finally {
      setLoading(false)
      console.log("[DEBUG] Submit finished, loading =", false)
    }
  }

  return (
    <section id="contact" className="py-12 px-4">
      <div className="max-w-2xl mx-auto bg-panel/60 rounded-lg p-6 shadow-md animate-slideUp">
        <h2 className="text-xl md:text-2xl font-bold text-cyansoft mb-3 text-center">
          Contact Me
        </h2>
        <p className="text-white/70 mb-6 text-center text-sm md:text-base">
          Have a project or question? Drop a message 🚀
        </p>

        <form onSubmit={submit} className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              required
              value={form.name}
              onChange={update('name')}
              placeholder="Your name"
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cyansoft text-sm md:text-base"
            />
            <input
              required
              value={form.email}
              onChange={update('email')}
              placeholder="Your email"
              type="email"
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cyansoft text-sm md:text-base"
            />
          </div>

          <textarea
            required
            value={form.message}
            onChange={update('message')}
            placeholder="Your message"
            rows={5}
            className="bg-transparent border border-white/20 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cyansoft text-sm md:text-base"
          />

          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto inline-flex justify-center items-center gap-2 bg-cyansoft text-black px-5 py-2 rounded-md font-semibold shadow-cyanglow hover:scale-[1.02] transition-transform"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            {status && (
              <div
                className={`text-sm ${
                  status.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {status.text}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
